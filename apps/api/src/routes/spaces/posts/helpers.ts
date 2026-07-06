import type { PostWithPets } from "../../../db/repositories";

export const toPostResponse = (post: PostWithPets) => ({
  id: post.id,
  body: post.body,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  photos: post.photos.map((photo) => ({
    id: photo.id,
    objectKey: photo.objectKey,
    sortOrder: photo.sortOrder,
    uploadId: photo.uploadId,
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt,
  })),
  pets: post.pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
    createdAt: pet.createdAt,
    updatedAt: pet.updatedAt,
  })),
});

export const uniqueIds = (ids: string[]) => [...new Set(ids)];
