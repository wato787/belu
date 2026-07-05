import { Hono } from "hono";
import type { AppHonoEnv } from "../config";

export const createRoute = () => new Hono<AppHonoEnv>();
