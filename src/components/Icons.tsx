'use client';

import { IPost } from '@/types/post';
import React, { useEffect, useState } from 'react';
import {
  HiHeart,
  HiOutlineChat,
  HiOutlineHeart,
  HiOutlineTrash,
} from 'react-icons/hi';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Icons({ post }: { post: IPost }) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<string[]>(post.likes || []);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && likes.includes(user.publicMetadata.userMongoId as string)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [likes, user]);

  function likePost(event: React.MouseEvent<SVGAElement, MouseEvent>): void {
    event.preventDefault();
    console.log('clicked');

    if (!user) {
      return router.push('/sign-in');
    }
    const userMongoId = user.publicMetadata.userMongoId as string;

    if (isLiked) {
      // User is un-liking
      setLikes(likes.filter(l => l !== userMongoId));
    } else if (!isLiked) {
      // User has liked
      setLikes([...likes, userMongoId]);
    }

    try {
      fetch('/api/posts/like', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post._id }),
      })
        .then(result => result.json())
        .then(json => {
          console.log('json', json);
          if (json.liked) {
            // User has liked
            setLikes([...likes, userMongoId]);
          } else {
            // User is un-liking
            setLikes(likes.filter(l => l !== userMongoId));
          }
        })
        .catch(error => {
          console.log('error', error);
          if (isLiked) {
            // User is un-liking
            setLikes(likes.filter(l => l !== userMongoId));
          } else if (!isLiked) {
            // User has liked
            setLikes([...likes, userMongoId]);
          }
        });
    } catch (error) {
      console.log('Error liking');
    }
  }

  return (
    <div className="flex justify-start gap-5 p-2 text-gray-500">
      <HiOutlineChat className="h-8 w-8 cursor-pointer rounded-full p-2 transition duration-500 ease-in-out hover:bg-sky-100 hover:text-sky-500"></HiOutlineChat>
      {isLiked ? (
        <HiHeart
          onClick={likePost}
          className="h-8 w-8 cursor-pointer rounded-full p-2 text-red-600 transition duration-500 ease-in-out hover:bg-red-100 hover:text-red-500"
        ></HiHeart>
      ) : (
        <HiOutlineHeart
          onClick={likePost}
          className="h-8 w-8 cursor-pointer rounded-full p-2 transition duration-500 ease-in-out hover:bg-red-100 hover:text-red-500"
        ></HiOutlineHeart>
      )}
      <span
        className={`flex items-center justify-center text-xs ${isLiked && 'text-red-600'}`}
      >
        {likes.length}
      </span>
      <HiOutlineTrash className="h-8 w-8 cursor-pointer rounded-full p-2 transition duration-500 ease-in-out hover:bg-red-100 hover:text-red-500"></HiOutlineTrash>
    </div>
  );
}
