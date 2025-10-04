import Post from '@/components/Post';
import { IPost } from '@/types/post';

export default function Feed({ posts }: { posts: IPost[] | null }) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-gray-200 p-2">
      {posts && posts.map(post => <Post post={post} key={post._id} />)}
    </div>
  );
}
