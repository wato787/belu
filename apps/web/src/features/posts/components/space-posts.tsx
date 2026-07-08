type SpacePostsProps = {
  spaceId: string;
};

export const SpacePosts = ({ spaceId }: SpacePostsProps) => (
  <main>
    <h1>Posts</h1>
    <p>{spaceId}</p>
  </main>
);
