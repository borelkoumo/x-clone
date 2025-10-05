'use client';

import { SignedIn, useUser } from '@clerk/nextjs';
import { HiOutlinePhotograph } from 'react-icons/hi';
import React, { useState, useRef, useEffect } from 'react';
import { app } from '@/lib/firebase/firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { slugify } from '@/lib/utils/slugify';

export default function Input() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<
    string | undefined | null
  >(undefined);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | undefined>(
    undefined,
  );
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [text, setText] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  const storage = getStorage(app);

  // if (!isSignedIn || !isLoaded) {
  //   return null;
  // }

  useEffect(() => {
    if (!selectedFile) return;

    // capture the object URL used for this upload so we can revoke it safely
    const currentObjectUrl = selectedFileUrl;

    setIsUploadingFile(true);

    let cancelled = false;
    uploadFileToFirebase(selectedFile)
      .then(({ success, fileUrl, errorMessage }) => {
        if (!cancelled && success) {
          setUploadedFileUrl(fileUrl);
        } else if (!success && errorMessage) {
          setErrorMessage(errorMessage);
        }
      })
      .catch(error => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setIsUploadingFile(false);

        if (currentObjectUrl) {
          try {
            URL.revokeObjectURL(currentObjectUrl);
          } catch (error) {}
        }
        setSelectedFile(null);
        setSelectedFileUrl(undefined);
      });

    return () => {
      cancelled = true;
      if (currentObjectUrl) {
        if (currentObjectUrl) {
          try {
            URL.revokeObjectURL(currentObjectUrl);
          } catch (error) {}
        }
      }
    };
  }, [selectedFile]);

  useEffect(() => {
    textareaRef?.current?.focus();
  }, []);

  function handleSelectedFileImageClicked(
    event: React.MouseEvent<SVGElement | HTMLImageElement>,
  ): void {
    resetPost();
  }

  function resetPost() {
    setUploadedFileUrl(undefined);
    setSelectedFile(null);
    setSelectedFileUrl(null);
    setErrorMessage('');
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.focus();
    }
  }

  function handleFileInputClicked(
    event: React.MouseEvent<SVGElement | HTMLImageElement>,
  ): void {
    fileInputRef.current?.click();
    setErrorMessage('');
  }

  function handleFileSelected(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files?.[0];

    if (!file) {
      console.log('No file');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select an image. Only images are allowed');
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
      setSelectedFile(file);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred.');
      }
    }
  }

  async function uploadFileToFirebase(file: File) {
    const storageRef = ref(
      storage,
      `images/${new Date().getTime()}_${slugify(file.name)}`,
    );
    // Push to firebase storage
    try {
      await uploadBytes(storageRef, file);
      // Let's get a download URL for the file.
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('File available at', downloadUrl);
      return { success: true, fileUrl: downloadUrl };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { success: false, errorMessage: error.message };
      }
      return { success: false, errorMessage: 'An unknown error occured' };
    }
  }

  async function handlePostSubmit() {
    if (!user) {
      return;
    }

    setIsSubmittingPost(true);
    setErrorMessage('');

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMongoId: user.publicMetadata.userMongoId,
        text,
        imageUrl: uploadedFileUrl,
      }),
    });

    setIsSubmittingPost(false);

    if (!response.ok) {
      setErrorMessage(
        `Unable to submit your post: ${response.status} ${response.statusText}`,
      );
      return;
    }
    location.reload();
  }

  return (
    <SignedIn>
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
            ref={textareaRef}
          />
          {(selectedFileUrl || uploadedFileUrl) && (
            <>
              <img
                src={
                  isUploadingFile && !!selectedFileUrl
                    ? selectedFileUrl
                    : uploadedFileUrl
                }
                alt="post image"
                className={`max-h-[250] w-full cursor-pointer object-cover transition-all duration-200 hover:opacity-50 ${isUploadingFile ? 'animate-pulse' : ''}`}
                onClick={handleSelectedFileImageClicked}
              />
            </>
          )}
          {errorMessage && (
            <p className="border-b-0 text-sm font-medium text-red-500">
              {errorMessage}
            </p>
          )}
          <div className="flex flex-row items-center justify-between pt-2">
            <HiOutlinePhotograph
              className="h-10 w-10 cursor-pointer rounded-full p-2 text-sky-500 hover:bg-sky-200"
              onClick={handleFileInputClicked}
            />
            <input
              type="file"
              name="file"
              id="file"
              multiple={false}
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileSelected}
            />
            <button
              className="h-10 w-fit cursor-pointer rounded-2xl bg-blue-400 px-4 py-2 text-center text-sm font-bold text-white transition-all duration-200 hover:brightness-95 disabled:opacity-50"
              disabled={
                isSubmittingPost || text.trim().length === 0 || isUploadingFile
              }
              onClick={handlePostSubmit}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
