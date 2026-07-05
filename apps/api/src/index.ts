import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { InternalServerException, NotFoundException } from "./exceptions";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

app.notFound((c) => {
  const error = new NotFoundException();

  return c.json({ message: error.message }, error.status);
});

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status);
  }

  const internalServerError = new InternalServerException();

  return c.json({ message: internalServerError.message }, internalServerError.status);
});

export type AppType = typeof app;

export default app;
