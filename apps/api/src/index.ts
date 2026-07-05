import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { v7 as uuidv7 } from "uuid";
import { createAuth } from "./auth";
import { authMiddleware } from "./auth-middleware";
import { getConfig, type AppHonoEnv } from "./config";
import { InternalServerException, NotFoundException } from "./exceptions";
import { logger } from "./logger";

const app = new Hono<AppHonoEnv>();

app.use(async (c, next) => {
  const startedAt = performance.now();
  const requestId = c.req.header("x-request-id") ?? uuidv7();

  c.header("x-request-id", requestId);

  await next();

  logger.info("request completed", {
    request_id: requestId,
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    duration: Math.round(performance.now() - startedAt),
  });
});

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  const auth = createAuth(c.env);

  return auth.handler(c.req.raw);
});

app.use(authMiddleware);

app.get("/health", (c) => {
  const config = getConfig(c.env);

  return c.json({ environment: config.app.env, status: "ok" });
});

app.notFound((c) => {
  const error = new NotFoundException();

  return c.json({ message: error.message }, error.status);
});

app.onError((error, c) => {
  const requestId = c.res.headers.get("x-request-id") ?? c.req.header("x-request-id");

  if (error instanceof HTTPException) {
    logger.warn("http exception", {
      request_id: requestId,
      method: c.req.method,
      path: c.req.path,
      status: error.status,
      error,
    });

    return c.json({ message: error.message }, error.status);
  }

  const internalServerError = new InternalServerException();

  logger.error("unexpected error", {
    request_id: requestId,
    method: c.req.method,
    path: c.req.path,
    status: internalServerError.status,
    error: error instanceof Error ? error : new Error("Unknown error"),
  });

  return c.json({ message: internalServerError.message }, internalServerError.status);
});

export type AppType = typeof app;

export default app;
