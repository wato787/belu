import { HTTPException } from "hono/http-exception";

export class ConflictException extends HTTPException {
  constructor(message = "Conflict") {
    super(409, { message });
  }
}
