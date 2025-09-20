'use client';

import { useUser } from '@clerk/nextjs';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function Input() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isSignedIn || !isLoaded) {
    return null
  }

  return (
    <div className="flex w-full space-x-3 border-b border-gray-200 p-2">
      <img
        src={user?.imageUrl}
        alt="User image"
        className="h-11 w-11 rounded-full object-cover hover:brightness-95"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          className="min-h-[50px] w-full tracking-wide text-gray-700 outline-none"
          name="text"
          placeholder="What's new"
          rows={2}
        />
        <div className="flex flex-row items-center justify-between pt-2">
          <HiOutlinePhotograph className="h-10 w-10 cursor-pointer rounded-full p-2 text-sky-500 hover:bg-sky-200" />
          <button className="w-fit h-10 cursor-pointer rounded-2xl bg-blue-400 px-4 py-2 text-center text-sm font-bold text-white transition-all duration-200 hover:brightness-95 disabled:opacity-50">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
