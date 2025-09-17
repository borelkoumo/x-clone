import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi';

export default function LeftSidebar() {
  return (
    <div className="flex flex-col gap-4 p-3">
      <Link href="/">
        <FaXTwitter className="h-16 w-16 cursor-pointer rounded-full p-3 transition-all duration-200 hover:bg-gray-100" />
      </Link>
      <Link href="/">
        <div className="flex w-fit cursor-pointer items-center justify-between gap-2 rounded-full p-3 transition-all duration-200 hover:bg-gray-100">
          <HiHome className="h-7 w-7" />
          <span className="hidden font-bold xl:inline">Home</span>
        </div>
      </Link>
      <button className="hidden h-9 w-48 cursor-pointer rounded-full bg-blue-400 font-bold text-white shadow-md transition-all duration-200 hover:brightness-95 xl:inline">
        Sign In
      </button>
    </div>
  );
}
