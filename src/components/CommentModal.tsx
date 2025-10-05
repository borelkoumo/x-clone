'use client';

import { useModal } from '@/contexts/ModalContext';
import { IPost } from '@/types/post';
import React, { useEffect, useState } from 'react';
import { HiX } from 'react-icons/hi';
import ReactModal from 'react-modal';
import Loader from './Loader';
import { useUser } from '@clerk/nextjs';

export default function CommentModal() {
  const { isOpen, setIsOpen, postId } = useModal();
  const [post, setPost] = useState<IPost | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [input, setInput] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchPost = async () => {
      console.log('post called');

      if (!postId) return;

      setIsPostLoading(true);
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.log('Error fetching post');
          return;
        }

        const post = (await res.json()).post as IPost;

        console.log('post requested', post);

        setPost(post);
        setIsPostLoading(false);
      } catch (error: any) {
        console.log('Error occured: ', error.message as string);
      }
    };

    fetchPost();
  }, [postId]);

  if (!isOpen) return null;
  if (!user) return null;

  async function sendComment(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    console.log('Sending post');
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      ariaHideApp={false}
      className="absolute top-24 left-[50%] w-[90%] max-w-lg translate-x-[-50%] rounded-xl border-2 border-gray-200 bg-white shadow-md"
    >
      <div className="p-4">
        <div className="border-b border-gray-200 px-1.5 py-2">
          <HiX
            className="cursor-pointer rounded-full p-1 text-2xl text-gray-700 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          ></HiX>
        </div>
        {isPostLoading ? (
          <Loader />
        ) : (
          post && (
            <>
              <div className="relative flex items-center space-x-1 p-2">
                <span className="absolute top-11 left-8 z-[-1] h-full w-0.5 bg-gray-300"></span>
                <img
                  src={post.user.avatar}
                  alt="user-img"
                  className="mr-4 h-11 w-11 rounded-full"
                />
                <h4 className="truncate text-[15px] font-bold hover:underline sm:text-[16px]">
                  {`${post?.user.firstName} ${post.user.lastName}`}
                </h4>
                <span className="truncate text-sm sm:text-[15px]">
                  @{`${post.user.username}`}
                </span>
              </div>
              <p className="mb-2 ml-16 text-[15px] text-gray-500 sm:text-[16px]">
                {post.text}
              </p>
              <div className="flex space-x-3 p-3">
                <img
                  src={user.imageUrl}
                  alt="user-img"
                  className="h-11 w-11 cursor-pointer rounded-full hover:brightness-95"
                />
                <div className="w-full divide-y divide-gray-200">
                  <div>
                    <textarea
                      className="min-h-[50px] w-full border-none tracking-wide text-gray-700 outline-none placeholder:text-gray-500"
                      placeholder="Reply to this..."
                      rows={2}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-end pt-2.5">
                    <button
                      className="rounded-full bg-blue-400 px-4 py-1.5 font-bold text-white shadow-md hover:brightness-95 disabled:opacity-50"
                      disabled={input.trim() === '' || isPostLoading}
                      onClick={sendComment}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </ReactModal>
  );
}
