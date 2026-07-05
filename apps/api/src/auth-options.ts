import { organization } from "better-auth/plugins";

export const authBasePath = "/api/auth";

export const createAuthPlugins = () => [organization()];
