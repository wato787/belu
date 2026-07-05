import { createMiddleware } from "hono/factory";
import { UnauthorizedException } from "./exceptions";
import { createAuth } from "./auth";
import type { AppHonoEnv } from "./config";

export const authMiddleware = createMiddleware<AppHonoEnv>(async (c, next) => {
  const auth = createAuth(c.env);
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);

  await next();
});

export const requireUser = createMiddleware<AppHonoEnv>(async (c, next) => {
  const user = c.get("user");

  if (!user) {
    throw new UnauthorizedException();
  }

  await next();
});
