import { createMiddleware } from "hono/factory";
import type { Context } from "hono";
import type { AppHonoEnv } from "../config";
import { BadRequestException, ForbiddenException, NotFoundException } from "../helpers/exceptions";
import { createAuth } from "../lib/better-auth";
import { getRequiredUser } from "./auth";

const getSpaceId = (c: Context<AppHonoEnv>) => {
  const spaceId = c.req.param("spaceId");

  if (!spaceId) {
    throw new BadRequestException("Space ID is required");
  }

  return spaceId;
};

const resolveSpaceMember = async (c: Context<AppHonoEnv>) => {
  const user = getRequiredUser(c);
  const auth = createAuth(c.env);
  const space = await auth.api.getFullOrganization({
    headers: c.req.raw.headers,
    query: {
      organizationId: getSpaceId(c),
    },
  });

  if (!space) {
    throw new NotFoundException("Space Not Found");
  }

  const spaceMember = space.members.find((member) => member.userId === user.id);

  if (!spaceMember) {
    throw new ForbiddenException();
  }

  c.set("space", space);
  c.set("spaceMember", spaceMember);

  return { space, spaceMember };
};

export const requireSpaceMember = createMiddleware<AppHonoEnv>(async (c, next) => {
  await resolveSpaceMember(c);

  await next();
});

export const requireSpaceOwner = createMiddleware<AppHonoEnv>(async (c, next) => {
  const { spaceMember } = await resolveSpaceMember(c);

  if (spaceMember.role !== "owner") {
    throw new ForbiddenException();
  }

  await next();
});
