import Feed from '@/components/Feed';
import Input from '@/components/Input';
import { getPosts } from '@/lib/actions/posts';
import { SignedIn } from '@clerk/nextjs';

export default async function Home() {
  let data = null;

  try {
    data = await getPosts();
    console.log('data', data);
  } catch (error) {
    console.log('error', error);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col">
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white px-2 py-3">
        <h1 className="text-lg font-bold sm:text-xl">Home</h1>
      </div>
      <SignedIn>
        <Input />
      </SignedIn>
      <Feed posts={data} />
    </div>
  );
}
