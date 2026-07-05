import type { AuthSessionData, AuthUser } from "./lib/better-auth";

export type AppEnvironment = "development" | "staging" | "production";

export type AppBindings = {
  APP_ENV?: AppEnvironment;
  AUTH_BASE_URL?: string;
  AUTH_SECRET?: string;
  AUTH_TRUSTED_ORIGINS?: string;
  DB: D1Database;
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
};

export type AppHonoEnv = {
  Bindings: AppBindings;
  Variables: {
    session: AuthSessionData | null;
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
  };
};
