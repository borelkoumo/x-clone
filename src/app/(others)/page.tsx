import Input from '@/components/Input';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col">
      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white px-2 py-3">
        <h1 className="text-lg font-bold sm:text-xl">Home</h1>
      </div>
      <Input />
    </div>
  );
}
