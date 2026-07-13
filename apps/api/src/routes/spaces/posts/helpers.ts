import type { PostWithPets } from "../../../db/repositories";
import type { Storage } from "../../../storage";

type ToPostResponseOptions = {
  storage: Storage;
};

export const toPostResponse = (post: PostWithPets, { storage }: ToPostResponseOptions) => ({
  id: post.id,
  body: post.body,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  photos: post.photos.map((photo) => ({
    id: photo.id,
    objectKey: photo.objectKey,
    sortOrder: photo.sortOrder,
    uploadId: photo.uploadId,
    url: storage.getPublicUrl({ key: photo.objectKey }),
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt,
  })),
  pets: post.pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
    createdAt: pet.createdAt,
    updatedAt: pet.updatedAt,
  })),
  reactionCounts: post.reactionCounts,
  viewerReactions: post.viewerReactions,
});

export const uniqueIds = (ids: string[]) => [...new Set(ids)];
