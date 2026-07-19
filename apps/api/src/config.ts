import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import type { AuthSessionData, AuthSpace, AuthSpaceMember, AuthUser } from "./lib/better-auth";

export type AppEnvironment = "development" | "staging" | "production";

export type AppBindings = {
  APP_ENV?: AppEnvironment;
  AUTH_BASE_URL?: string;
  AUTH_SECRET?: string;
  AUTH_TRUSTED_ORIGINS?: string;
  DB: D1Database;
  PHOTOS_PUBLIC_BASE_URL?: string;
  PHOTOS_BUCKET: R2Bucket;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_BUCKET_NAME?: string;
  R2_SECRET_ACCESS_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_SUBJECT?: string;
};

export type AppConfig = {
  app: {
    env: AppEnvironment;
  };
  auth: {
    baseUrl: string | undefined;
    secret: string | undefined;
    trustedOrigins: string[];
  };
  database: {
    binding: D1Database;
  };
  storage: {
    photosBucket: R2Bucket;
    photosPublicBaseUrl: string | undefined;
    r2AccountId: string | undefined;
    r2AccessKeyId: string | undefined;
    r2BucketName: string | undefined;
    r2SecretAccessKey: string | undefined;
  };
  webPush: {
    vapidPrivateKey: string | undefined;
    vapidPublicKey: string | undefined;
    vapidSubject: string | undefined;
  };
};

export type AppHonoEnv = {
  Bindings: AppBindings;
  Variables: {
    session: AuthSessionData | null;
    space: AuthSpace;
    spaceMember: AuthSpaceMember;
    user: AuthUser | null;
  };
};

const parseTrustedOrigins = (value: string | undefined) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0) ?? [];

export const getConfig = (bindings: AppBindings): AppConfig => {
  const env = bindings.APP_ENV ?? "development";
  const baseUrl =
    bindings.AUTH_BASE_URL ?? (env === "development" ? "http://localhost:8787" : undefined);

  return {
    app: {
      env,
    },
    auth: {
      baseUrl,
      secret: bindings.AUTH_SECRET,
      trustedOrigins: parseTrustedOrigins(bindings.AUTH_TRUSTED_ORIGINS),
    },
    database: {
      binding: bindings.DB,
    },
    storage: {
      photosBucket: bindings.PHOTOS_BUCKET,
      photosPublicBaseUrl: bindings.PHOTOS_PUBLIC_BASE_URL,
      r2AccountId: bindings.R2_ACCOUNT_ID,
      r2AccessKeyId: bindings.R2_ACCESS_KEY_ID,
      r2BucketName: bindings.R2_BUCKET_NAME,
      r2SecretAccessKey: bindings.R2_SECRET_ACCESS_KEY,
    },
    webPush: {
      vapidPrivateKey: bindings.VAPID_PRIVATE_KEY,
      vapidPublicKey: bindings.VAPID_PUBLIC_KEY,
      vapidSubject: bindings.VAPID_SUBJECT,
    },
  };
};
