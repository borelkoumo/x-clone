import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from '@clerk/nextjs';
import MiniProfile from './MiniProfile';

export default function LeftSidebar() {
  return (
    <div className="flex h-screen flex-col justify-between pb-4">
      <div className="flex flex-col gap-4 md:p-3">
        <Link href="/">
          <FaXTwitter className="h-14 w-14 cursor-pointer rounded-full p-3 transition-all duration-200 hover:bg-gray-100 md:h-16 md:w-16" />
        </Link>
        <Link href="/">
          <div className="flex w-fit cursor-pointer items-center justify-between gap-2 rounded-full p-3 transition-all duration-200 hover:bg-gray-100">
            <HiHome className="h-7 w-7" />
            <span className="hidden font-bold xl:inline">Home</span>
          </div>
        </Link>
        <SignedIn>
          <SignOutButton>
            <button className="font-semi-bold hidden h-9 w-48 cursor-pointer rounded-full bg-blue-400 text-white shadow-md transition-all duration-200 hover:brightness-95 xl:inline">
              Sign Out
            </button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className="font-semi-bold hidden h-9 w-48 cursor-pointer rounded-full bg-blue-400 text-white shadow-md transition-all duration-200 hover:brightness-95 xl:inline">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
      <SignedIn>
        <MiniProfile />
      </SignedIn>
    </div>
  );
}
