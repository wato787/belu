import type { AuthUser } from "../../lib/better-auth";

export const formatMeUser = (user: AuthUser) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const formatMeSpace = (space: {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
}) => ({
  id: space.id,
  name: space.name,
  slug: space.slug,
  createdAt: space.createdAt,
  logo: space.logo ?? null,
});
