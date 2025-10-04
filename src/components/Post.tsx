import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import Link from 'next/link';
import React from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Icons from './Icons';
dayjs.extend(relativeTime);

export default function Post({ post }: { post: IPost }) {
  const user = post.user as IUser;
  const postDate = dayjs(post.createdAt).fromNow();
  return (
    <div className="flex w-full border-b border-gray-200 p-3 hover:bg-gray-50">
      <Link href={`/users/${user.username}`}>
        <img
          src={user.avatar}
          alt="user avatar"
          className="mr-4 h-11 w-11 rounded-full"
        />
      </Link>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 whitespace-nowrap">
            <h4 className="max-w-32 truncate text-xs font-bold">
              <p>
                {user.firstName} {user.lastName}
              </p>
            </h4>
            <span className="max-w-32 truncate text-xs">@{user.username}</span>
            <span className="text-xl text-gray-500">.</span>
            <span className="max-w-32 flex-1 truncate text-xs text-gray-500">
              {postDate}
            </span>
          </div>
          <HiDotsHorizontal className="text-sm"></HiDotsHorizontal>
        </div>

        {post.text && (
          <Link href={`/posts/${post._id}`}>
            <p className="my-3 w-full text-sm text-gray-800">{post.text}</p>
          </Link>
        )}
        {post.imageUrl && (
          <Link href={`/posts/${post._id}`}>
            <p className="my-3 w-full text-sm text-gray-800">{post.text}</p>
            <img
              src={post.imageUrl}
              alt="post image"
              className="max-h-[250] w-full object-cover"
            />
          </Link>
        )}
        <Icons post={post}></Icons>
      </div>
    </div>
  );
}
