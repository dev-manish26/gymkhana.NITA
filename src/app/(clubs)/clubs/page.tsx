'use client';

import React, { useState } from 'react';
import { data } from 'src/assets/data.js';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';

interface Club {
  club: string;
  category: string;
  url: string;
  image: string | StaticImageData;
  description: string;
  social: {
    instagram: string;
    linkedin: string;
    twitter: string;
  };
}

const Clubs: React.FC = () => {
  const [category, setCategory] = useState<string>('Communities');

  // Filtering logic
  const filteredData: Club[] = data.filter(
    (item: Club) => item.category === category
  );

  return (
    <div className='mx-auto max-w-6xl p-4'>
      {/* Filter Buttons */}
      <div className='mb-6 flex space-x-4 overflow-x-auto whitespace-nowrap pb-2'>
        {['Communities', 'Technical', 'Cultural', 'Sports', 'Others'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-semibold ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Grid Display */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {filteredData.map((item: Club, index: number) => (
          <div
            key={index}
            className='group relative flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg'
          >
            {/* Hover Description */}
            <div
              className='absolute inset-0 z-10 rounded-t-lg bg-white/40 opacity-0 backdrop-blur-[2px] transition-all duration-500 ease-in-out group-hover:opacity-100'
              style={{ height: '55%' }}
            >
              <div className='mx-4 text-center'>
                <p className='pt-4 text-sm font-medium text-gray-700 drop-shadow-lg'>
                  {item.description}
                </p>
              </div>
            </div>

            {/* Club Logo */}
            <div className='flex h-32 w-40 items-center justify-center'>
              <Image
                src={item.image}
                alt={item.club}
                width={120}
                height={120}
                className=''
              />
            </div>

            {/* Club Info */}
            <div className='mt-4 text-center'>
              <h3 className='text-gray-800 text-md font-semibold uppercase tracking-wider'>
                {item.club}
              </h3>
              <p className='text-gray-700 text-xs uppercase tracking-wide'>
                NIT AGARTALA
              </p>
            </div>

            <div className='mt-4 flex space-x-2'>
              <a
                href={item.social.instagram}
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-6 w-6 items-center justify-center rounded-full text-white opacity-90 transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-100 hover:shadow-lg'
                title='Instagram'
              >
                <Image
                  src='/instagram.svg'
                  alt='Instagram'
                  width={20}
                  height={20}
                />
              </a>

              <a
                href={item.social.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-6 w-6 items-center justify-center rounded-full text-white opacity-90 transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-100 hover:shadow-lg'
                title='LinkedIn'
              >
                <Image
                  src='/linkedin.svg'
                  alt='Instagram'
                  width={22}
                  height={22}
                />
              </a>

              <a
                href={item.social.twitter}
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-6 w-6 items-center justify-center rounded-full text-white opacity-90 transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-100 hover:shadow-lg'
                title='Twitter/X'
              >
                <Image
                  src='/twitter.svg'
                  alt='Instagram'
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clubs;
