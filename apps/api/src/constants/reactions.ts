export const REACTION_TYPES = ["like", "love", "laugh", "surprise", "sad"] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];
