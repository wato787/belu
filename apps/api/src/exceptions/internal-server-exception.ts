import { HTTPException } from "hono/http-exception";

export class InternalServerException extends HTTPException {
  constructor(message = "Internal Server Error") {
    super(500, { message });
  }
}
