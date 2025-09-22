'use client';

import { useUser } from '@clerk/nextjs';
import { HiOutlinePhotograph } from 'react-icons/hi';
import React, { useState, useRef, useEffect } from 'react';
import { app } from '@/lib/firebase/firebase';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { slugify } from '@/lib/utils/slugify';

export default function Input() {
  const { user, isSignedIn, isLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | undefined>(
    undefined
  );
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | undefined>(
    undefined
  );
  const [isUploading, setIsUploading] = useState(false);
  const storage = getStorage(app);

  if (!isSignedIn || !isLoaded) {
    return null;
  }

  useEffect(() => {
    if (!selectedFile) return;

    // capture the object URL used for this upload so we can revoke it safely
    const currentObjectUrl = selectedFileUrl;

    setIsUploading(true);

    let cancelled = false;
    (async () => {
      try {
        const fileUrl = await uploadFileToFirebase(selectedFile);
        if (!cancelled && fileUrl) {
          setUploadedFileUrl(fileUrl);
        }
      } catch (error) {
        console.log('Error occured', error);
      } finally {
        if (!cancelled) {
          setIsUploading(false);

          // clear the local preview and revoke the object URL now that upload finished
          if (currentObjectUrl) {
            try {
              URL.revokeObjectURL(currentObjectUrl);
            } catch (e) {
              /* ignore revoke errors */
            }
          }
          setSelectedFile(null);
          setSelectedFileUrl(undefined);
        }
      }
    })();

    // cleanup if selectedFile changes / component unmounts while upload in-flight
    return () => {
      cancelled = true;
      if (currentObjectUrl) {
        try {
          URL.revokeObjectURL(currentObjectUrl);
        } catch (e) {
          /* ignore revoke errors */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  function handleFileInputInputClicked(
    event: React.MouseEvent<SVGElement | HTMLImageElement>
  ): void {
    fileInputRef.current?.click();
  }

  function handleFileSelected(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setSelectedFileUrl(url);
    }
  }

  async function uploadFileToFirebase(file: File) {
    const storageRef = ref(
      storage,
      `images/${new Date().getTime()}_${slugify(file.name)}`
    );
    // Push to child path.
    try {
      await uploadBytes(storageRef, file);
      // Let's get a download URL for the file.
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('File available at', downloadUrl);
      return downloadUrl;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
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
        {(selectedFileUrl || uploadedFileUrl) && (
          <img
            src={isUploading ? selectedFileUrl : uploadedFileUrl}
            alt="post image"
            className={`max-h-[250px] w-full cursor-pointer object-cover transition-all duration-200 hover:opacity-50 ${
              isUploading ? 'animate-pulse' : ''
            }`}
            onClick={handleFileInputInputClicked}
          />
        )}
        <div className="flex flex-row items-center justify-between pt-2">
          <HiOutlinePhotograph
            className="h-10 w-10 cursor-pointer rounded-full p-2 text-sky-500 hover:bg-sky-200"
            onClick={handleFileInputInputClicked}
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
          <button className="h-10 w-fit cursor-pointer rounded-2xl bg-blue-400 px-4 py-2 text-center text-sm font-bold text-white transition-all duration-200 hover:brightness-95 disabled:opacity-50">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
