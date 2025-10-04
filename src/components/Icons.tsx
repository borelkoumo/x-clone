'use client';

import { IPost } from '@/types/post';
import { HiOutlineChat, HiOutlineHeart, HiOutlineTrash } from 'react-icons/hi';

export default function Icons({ post }: { post: IPost }) {
  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat className="h-8 w-8 cursor-pointer rounded-full p-2 transition duration-500 ease-in-out hover:bg-sky-100 hover:text-sky-500"></HiOutlineChat>
      <HiOutlineHeart className="h-8 w-8 cursor-pointer rounded-full p-2 transition duration-500 ease-in-out hover:bg-red-100 hover:text-red-500"></HiOutlineHeart>
      <HiOutlineTrash className="h-8 w-8 cursor-pointer rounded-full p-2 transition duration-500 ease-in-out hover:bg-red-100 hover:text-red-500"></HiOutlineTrash>
    </div>
  );
}
