import type { Db } from "../client";
import { photos, type NewPhoto, type Photo } from "../schema";

type CreatePhotoInput = Pick<NewPhoto, "objectKey" | "postId"> & Pick<Photo, "id">;

export type PhotoRepository = {
  create: (input: CreatePhotoInput) => Promise<Photo | undefined>;
};

export const createPhotoRepository = (db: Db): PhotoRepository => ({
  create: async (input) => {
    const [photo] = await db.insert(photos).values(input).returning();

    return photo;
  },
});
