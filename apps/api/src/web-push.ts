import type { PushSubscription } from "./db/schema";

type WebPushConfig = {
  vapidPrivateKey: string | undefined;
  vapidPublicKey: string | undefined;
  vapidSubject: string | undefined;
};

type SendWebPushInput = {
  payload: unknown;
  subscription: Pick<PushSubscription, "auth" | "endpoint" | "p256dh">;
};

type WebPushSendResult =
  | { status: "sent" }
  | { status: "expired" }
  | { status: "skipped" }
  | { status: "failed"; statusCode: number };

const encoder = new TextEncoder();

const encodeBase64Url = (value: ArrayBuffer | Uint8Array) => {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  const binary = String.fromCharCode(...bytes);

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const toArrayBuffer = (bytes: Uint8Array) =>
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

const concatBytes = (...chunks: Uint8Array[]) => {
  const result = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0));
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
};

const hmacSha256 = async (key: Uint8Array, data: Uint8Array) => {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(key),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );

  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, toArrayBuffer(data)));
};

const hkdfExpand = async (prk: Uint8Array, info: Uint8Array, length: number) => {
  const chunks: Uint8Array[] = [];
  let previous = new Uint8Array();
  let outputLength = 0;
  let counter = 1;

  while (outputLength < length) {
    previous = await hmacSha256(prk, concatBytes(previous, info, new Uint8Array([counter])));
    chunks.push(previous);
    outputLength += previous.length;
    counter += 1;
  }

  return concatBytes(...chunks).slice(0, length);
};

const createVapidJwt = async ({
  audience,
  privateKey,
  publicKey,
  subject,
}: {
  audience: string;
  privateKey: string;
  publicKey: string;
  subject: string;
}) => {
  const publicKeyBytes = decodeBase64Url(publicKey);
  const privateKeyBytes = decodeBase64Url(privateKey);
  const key = await crypto.subtle.importKey(
    "jwk",
    {
      crv: "P-256",
      d: encodeBase64Url(privateKeyBytes),
      ext: false,
      key_ops: ["sign"],
      kty: "EC",
      x: encodeBase64Url(publicKeyBytes.slice(1, 33)),
      y: encodeBase64Url(publicKeyBytes.slice(33, 65)),
    },
    { namedCurve: "P-256", name: "ECDSA" },
    false,
    ["sign"],
  );
  const header = encodeBase64Url(encoder.encode(JSON.stringify({ alg: "ES256", typ: "JWT" })));
  const payload = encodeBase64Url(
    encoder.encode(
      JSON.stringify({
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
        sub: subject,
      }),
    ),
  );
  const signedContent = `${header}.${payload}`;
  const signature = await crypto.subtle.sign(
    { hash: "SHA-256", name: "ECDSA" },
    key,
    encoder.encode(signedContent),
  );

  return `${signedContent}.${encodeBase64Url(signature)}`;
};

const encryptPayload = async ({
  authSecret,
  clientPublicKey,
  payload,
}: {
  authSecret: Uint8Array;
  clientPublicKey: Uint8Array;
  payload: Uint8Array;
}) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyPair = (await crypto.subtle.generateKey({ namedCurve: "P-256", name: "ECDH" }, true, [
    "deriveBits",
  ])) as CryptoKeyPair;
  const exportedServerPublicKey = (await crypto.subtle.exportKey(
    "raw",
    keyPair.publicKey,
  )) as ArrayBuffer;
  const serverPublicKey = new Uint8Array(exportedServerPublicKey);
  const importedClientPublicKey = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(clientPublicKey),
    { namedCurve: "P-256", name: "ECDH" },
    false,
    [],
  );
  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "ECDH", public: importedClientPublicKey } as never,
      keyPair.privateKey,
      256,
    ),
  );
  const prkKey = await hmacSha256(authSecret, sharedSecret);
  const keyInfo = concatBytes(
    encoder.encode("WebPush: info"),
    new Uint8Array([0]),
    clientPublicKey,
    serverPublicKey,
  );
  const ikm = await hkdfExpand(prkKey, keyInfo, 32);
  const prk = await hmacSha256(salt, ikm);
  const cek = await hkdfExpand(prk, encoder.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdfExpand(prk, encoder.encode("Content-Encoding: nonce\0"), 12);
  const cryptoKey = await crypto.subtle.importKey("raw", toArrayBuffer(cek), "AES-GCM", false, [
    "encrypt",
  ]);
  const plaintext = concatBytes(payload, new Uint8Array([2]));
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { iv: toArrayBuffer(nonce), name: "AES-GCM" },
      cryptoKey,
      toArrayBuffer(plaintext),
    ),
  );
  const recordSize = new Uint8Array([0, 0, 16, 0]);
  const keyIdLength = new Uint8Array([serverPublicKey.length]);

  return concatBytes(salt, recordSize, keyIdLength, serverPublicKey, ciphertext);
};

export const createWebPush = (config: WebPushConfig) => {
  const isConfigured = Boolean(
    config.vapidPrivateKey && config.vapidPublicKey && config.vapidSubject,
  );

  return {
    getPublicKey: () => config.vapidPublicKey || null,

    send: async ({ payload, subscription }: SendWebPushInput): Promise<WebPushSendResult> => {
      if (!isConfigured) {
        return { status: "skipped" };
      }

      const endpointUrl = new URL(subscription.endpoint);
      const audience = `${endpointUrl.protocol}//${endpointUrl.host}`;
      const jwt = await createVapidJwt({
        audience,
        privateKey: config.vapidPrivateKey as string,
        publicKey: config.vapidPublicKey as string,
        subject: config.vapidSubject as string,
      });
      const encryptedPayload = await encryptPayload({
        authSecret: decodeBase64Url(subscription.auth),
        clientPublicKey: decodeBase64Url(subscription.p256dh),
        payload: encoder.encode(JSON.stringify(payload)),
      });
      const response = await fetch(subscription.endpoint, {
        body: encryptedPayload,
        headers: {
          Authorization: `vapid t=${jwt}, k=${config.vapidPublicKey}`,
          "Content-Encoding": "aes128gcm",
          "Content-Type": "application/octet-stream",
          TTL: "86400",
          Urgency: "normal",
        },
        method: "POST",
      });

      if (response.ok) {
        return { status: "sent" };
      }

      if (response.status === 404 || response.status === 410) {
        return { status: "expired" };
      }

      return { status: "failed", statusCode: response.status };
    },
  };
};
