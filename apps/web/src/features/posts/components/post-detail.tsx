type PostDetailProps = {
  postId: string;
  spaceId: string;
};

export const PostDetail = ({ postId, spaceId }: PostDetailProps) => (
  <main>
    <h1>Post</h1>
    <p>
      {spaceId} / {postId}
    </p>
  </main>
);
