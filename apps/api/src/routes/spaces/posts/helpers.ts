import type { PostWithPets } from "../../../db/repositories";
import type { Storage } from "../../../storage";

type ToPostResponseOptions = {
  storage: Storage;
};

type PostPhotoResponse = {
  id: string;
  objectKey: string;
  sortOrder: number;
  uploadId: string;
  url: string | null;
  createdAt: string;
  updatedAt: string;
};

type PostResponse = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  photos: PostPhotoResponse[];
  pets: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
  reactionCounts: PostWithPets["reactionCounts"];
  viewerReactions: PostWithPets["viewerReactions"];
};

const toPhotoResponse = async (
  photo: PostWithPets["photos"][number],
  { storage }: ToPostResponseOptions,
): Promise<PostPhotoResponse> => {
  const publicUrl = storage.getPublicUrl({ key: photo.objectKey });
  const url = publicUrl ?? (await storage.createSignedPhotoReadUrl({ key: photo.objectKey }));

  return {
    id: photo.id,
    objectKey: photo.objectKey,
    sortOrder: photo.sortOrder,
    uploadId: photo.uploadId,
    url,
    createdAt: photo.createdAt,
    updatedAt: photo.updatedAt,
  };
};

export const toPostResponse = async (
  post: PostWithPets,
  options: ToPostResponseOptions,
): Promise<PostResponse> => {
  const photos = await Promise.all(post.photos.map((photo) => toPhotoResponse(photo, options)));

  return {
    id: post.id,
    body: post.body,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    photos,
    pets: post.pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    })),
    reactionCounts: post.reactionCounts,
    viewerReactions: post.viewerReactions,
  };
};

export const uniqueIds = (ids: string[]) => [...new Set(ids)];
