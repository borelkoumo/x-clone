'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import News from './News';

export default function RightSidebar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(searchTerm);

    if (!searchTerm?.trim()) return;
    router.push(`/search/${searchTerm}`);
  };

  return (
    <div>
      <div className="sticky top-0 bg-white py-2">
        <form action="#" onSubmit={handleSubmit}>
          <input
            type="text"
            name="searchTerm"
            placeholder="Search"
            value={searchTerm}
            className="w-full rounded-3xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm"
            onChange={event => setSearchTerm(event.target.value)}
          />
        </form>
      </div>
      <div>
        <News />
      </div>
    </div>
  );
}
