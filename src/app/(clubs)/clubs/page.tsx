"use client";

import React, { useState } from "react";
import { data } from "src/assets/data.js";
import type { StaticImageData } from "next/image";
import Image from "next/image";

interface Club {
  club: string;
  category: string;
  url: string;
  image: string | StaticImageData;
}

const Clubs: React.FC = () => {
  const [category, setCategory] = useState<string>("All");

  // Filtering logic
  const filteredData: Club[] = category === "All"
    ? data.filter((item: Club) => item.category !== "Communities")
    : data.filter((item: Club) => item.category === category);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6 overflow-x-auto whitespace-nowrap">
        {["All", "Communities", "Technical", "Cultural", "Others"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex-shrink-0 ${
              category === cat ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {filteredData.map((item: Club, index: number) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center aspect-[4/3]"
          >
            <div className="w-32 h-32">
              <Image
                src={item.image}
                alt={item.club}
                width={128}
                height={128}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <div className="text-center mt-4">
              <h3 className="text-navy-900 font-semibold text-sm uppercase tracking-wider">
                {item.club}
              </h3>
              <p className="text-navy-700 text-xs uppercase tracking-wide">NIT AGARTALA</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Clubs;