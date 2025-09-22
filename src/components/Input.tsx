'use client';

import { useUser } from '@clerk/nextjs';
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
  const { user, isSignedIn, isLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | undefined>(
    undefined,
  );
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | undefined>(
    undefined,
  );
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState('');

  const storage = getStorage(app);

  if (!isSignedIn || !isLoaded) {
    return null;
  }

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
          setUploadErrorMessage(errorMessage);
        }
      })
      .catch(error => {
        setUploadErrorMessage(error.message);
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

  function handleFileInputInputClicked(
    event: React.MouseEvent<SVGElement | HTMLImageElement>,
  ): void {
    fileInputRef.current?.click();
    setUploadErrorMessage('');
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
      setUploadErrorMessage('Please select an image. Only images are allowed');
      return;
    }

    try {
      const url = URL.createObjectURL(file);
      setSelectedFileUrl(url);
      setSelectedFile(file);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setUploadErrorMessage(error.message);
      } else {
        setUploadErrorMessage('An unknown error occurred.');
      }
    }
  }

  async function uploadFileToFirebase(file: File) {
    // const storageRef = ref(
    //   storage,
    //   `images/${new Date().getTime()}_${slugify(file.name)}`,
    // );
    // // Push to firebase storage
    // const uploadTask = uploadBytesResumable(storageRef, file);
    // uploadTask.on(
    //   'state_changed',
    //   snapshot => {
    //     // Observe state change events such as progress, pause, and resume
    //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log('Upload is ' + progress + '% done');
    //     switch (snapshot.state) {
    //       case 'paused':
    //         console.log('Upload is paused');
    //         break;
    //       case 'running':
    //         console.log('Upload is running');
    //         break;
    //     }
    //   },
    //   error => {
    //     setIsUploadingFile(false);
    //     setUploadErrorMessage(error.message);
    //   },
    //   () => {
    //     // Handle successful uploads on complete
    //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    //     getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
    //       console.log('File available at', downloadURL);
    //       setUploadedFileUrl(downloadURL);
    //       setIsUploadingFile(false);
    //       setUploadErrorMessage('');
    //     });
    //   },
    // );
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
          <>
            <img
              src={isUploadingFile ? selectedFileUrl : uploadedFileUrl}
              alt="post image"
              className={`max-h-[250] w-full cursor-pointer object-cover transition-all duration-200 hover:opacity-50 ${isUploadingFile ? 'animate-pulse' : ''}`}
              onClick={handleFileInputInputClicked}
            />
          </>
        )}
        {uploadErrorMessage && (
          <p className="border-b-0 text-sm font-medium text-red-500">
            {uploadErrorMessage}
          </p>
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
