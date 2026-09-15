"use client";

import Image from "next/image";
import { useState } from "react";

const images = Array.from({ length: 26 }, (_, i) => `/assets/officers/pictures/${i + 1}.jpg`);

export function OfficerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const showPrevious = () => {
    setCurrentIndex((index) => (index - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setCurrentIndex((index) => (index + 1) % images.length);
  };

  return (
    <div className="relative h-[60vh] min-h-[24rem] overflow-hidden rounded-2xl bg-[#0D2E14] shadow-lift md:h-[80vh]">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div className="relative h-full min-w-full" key={src}>
            <Image
              src={src}
              alt={`GESS officer portrait ${index + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent" />
      <button
        type="button"
        onClick={showPrevious}
        aria-label="Show previous officer image"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-6 py-2 text-sm font-bold tracking-[.12em] text-white backdrop-blur-md transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-[#7BC635] md:left-8"
      >
        ← PREV
      </button>
      <button
        type="button"
        onClick={showNext}
        aria-label="Show next officer image"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-6 py-2 text-sm font-bold tracking-[.12em] text-white backdrop-blur-md transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-[#7BC635] md:right-8"
      >
        NEXT →
      </button>
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold tracking-[.16em] text-white/80">
        {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
      </p>
    </div>
  );
}
