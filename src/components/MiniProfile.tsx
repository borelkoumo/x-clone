'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { HiDotsHorizontal } from 'react-icons/hi';

export default function MiniProfile() {
  const { user } = useUser();

  return (
    <div className="flex w-fit cursor-pointer items-center justify-between gap-2 rounded-full p-3 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-100 xl:w-50">
      <UserButton />
      <div className="hidden w-8 flex-1 xl:inline">
        <h4 className="truncate text-sm font-bold">{user && user?.fullName}</h4>
        <p className="truncate text-sm text-gray-500">
          @{user && user.username}
        </p>
      </div>
      <HiDotsHorizontal className="hidden h-3 w-3 xl:inline" />
    </div>
  );
}
