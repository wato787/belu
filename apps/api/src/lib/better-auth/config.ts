import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "../../db/schema";
import { authBasePath, createAuthPlugins } from ".";

// Better Auth CLI は Drizzle schema 生成のために auth instance の export を要求する。
// runtime の認証は Workers bindings を使うため、index.ts で request ごとに作成する。
export const auth = betterAuth({
  basePath: authBasePath,
  baseURL: "http://localhost:8787",
  database: drizzleAdapter({} as never, {
    provider: "sqlite",
    schema,
  }),
  plugins: createAuthPlugins(),
  secret: "schema-generation-only-secret-for-belu-api",
});
