import { HTTPException } from "hono/http-exception";

export class ForbiddenException extends HTTPException {
  constructor(message = "Forbidden") {
    super(403, { message });
  }
}
