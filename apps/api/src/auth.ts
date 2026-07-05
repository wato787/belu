import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { authBasePath, createAuthPlugins } from "./auth-options";
import { getConfig, type AppBindings } from "./config";
import { createDb } from "./db/client";
import * as schema from "./db/schema";

export const createAuth = (bindings: AppBindings) => {
  const config = getConfig(bindings);
  const db = createDb(config.database.binding);

  return betterAuth({
    basePath: authBasePath,
    baseURL: config.auth.baseUrl,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    plugins: createAuthPlugins(),
    secret: config.auth.secret,
    trustedOrigins: config.auth.trustedOrigins,
  });
};

export type Auth = ReturnType<typeof createAuth>;
export type AuthSession = Awaited<ReturnType<Auth["api"]["getSession"]>>;
export type AuthUser = NonNullable<AuthSession>["user"];
export type AuthSessionData = NonNullable<AuthSession>["session"];
