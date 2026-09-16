"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Crosshair } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface Officer {
  name: string;
  role: string;
  committee: string;
  image: string;
  alt: string;
}

interface OfficerCarouselProps {
  officers: Officer[];
}

export function OfficerCarousel({ officers }: OfficerCarouselProps) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const dragged = useRef(false);
  const total = officers.length;

  useEffect(() => {
    setActive(0);
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setActive((current) => (current - 1 + total) % total);
      if (event.key === "ArrowRight") setActive((current) => (current + 1) % total);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total]);

  if (total === 0) return null;

  const previous = () => setActive((current) => (current - 1 + total) % total);
  const next = () => setActive((current) => (current + 1) % total);

  const getOffset = (index: number) => {
    const raw = index - active;
    if (raw > total / 2) return raw - total;
    if (raw < -total / 2) return raw + total;
    return raw;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    dragged.current = false;
    dragStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const distance = event.clientX - dragStart.current;
    dragged.current = Math.abs(distance) > 8;
    setDragging(false);

    if (distance < -40) next();
    if (distance > 40) previous();
  };

  return (
    <section aria-roledescription="carousel" aria-label="GESS officers" className="relative select-none">
      <div
        className="relative flex h-[17rem] touch-pan-y items-center justify-center overflow-hidden sm:h-[23rem] lg:h-[29rem] xl:h-[32rem]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => setDragging(false)}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        {officers.map((officer, index) => {
          const offset = getOffset(index);
          const isActive = offset === 0;
          const isAdjacent = Math.abs(offset) === 1;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          return (
            <button
              key={officer.image}
              type="button"
              aria-label={`View ${officer.name}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => {
                if (!dragged.current) setActive(index);
              }}
              className="absolute w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-forest text-left shadow-lift focus:outline-none focus:ring-2 focus:ring-topo focus:ring-offset-2 focus:ring-offset-forest sm:w-[34rem] lg:w-[42rem] xl:w-[44rem]"
              style={{
                borderColor: isActive ? "rgba(123, 198, 53, .68)" : "rgba(43, 102, 54, .40)",
                transform: `translateX(${offset * (isActive ? 0 : 43)}%) scale(${isActive ? 1 : isAdjacent ? 0.76 : 0.58})`,
                opacity: isActive ? 1 : isAdjacent ? 0.68 : 0.24,
                zIndex: isActive ? 10 : isAdjacent ? 6 : 3,
                transition: dragging ? "none" : "transform 300ms ease-out, opacity 300ms ease-out, box-shadow 300ms ease-out",
              }}
            >
              <div className="relative aspect-video bg-[#071c0c]">
                <Image
                  src={officer.image}
                  alt={officer.alt}
                  fill
                  sizes="(max-width: 640px) 336px, (max-width: 1024px) 544px, 704px"
                  draggable={false}
                  className="object-contain transition-transform duration-300 motion-reduce:transition-none"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061b0b]/95 via-[#061b0b]/18 to-transparent" />
                <div className="absolute right-3 top-3 rounded-full border border-topo/35 bg-forest/65 p-1.5 text-topo backdrop-blur-sm">
                  <Crosshair aria-hidden="true" size={15} strokeWidth={1.6} />
                </div>
                {isActive && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-topo/45 bg-forest/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-topo backdrop-blur-sm">
                    <i className="h-1.5 w-1.5 rounded-full bg-topo" /> Officer profile
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                  <p className="font-display text-base font-bold leading-tight text-white sm:text-xl lg:text-2xl">{officer.name}</p>
                  <p className="mt-1 text-xs font-bold text-topo sm:text-sm lg:text-base">{officer.role}</p>
                  <p className="mt-1 text-[10px] text-white/60 sm:text-xs lg:text-sm">{officer.committee}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 sm:mt-5">
        <button type="button" onClick={previous} aria-label="Previous officer" className="grid h-11 w-11 place-items-center rounded-full border border-topo/35 bg-white/5 text-topo transition hover:bg-topo hover:text-forest focus:outline-none focus:ring-2 focus:ring-topo focus:ring-offset-2 focus:ring-offset-forest">
          <ChevronLeft aria-hidden="true" size={20} />
        </button>
        <div className="flex max-w-[13rem] flex-wrap justify-center gap-1.5" aria-label={`Slide ${active + 1} of ${total}`}>
          {officers.map((officer, index) => (
            <button
              key={officer.image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View ${officer.name}`}
              aria-current={index === active ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-topo focus:ring-offset-2 focus:ring-offset-forest ${index === active ? "w-6 bg-topo" : "w-2 bg-topo/30 hover:bg-topo/70"}`}
            />
          ))}
        </div>
        <button type="button" onClick={next} aria-label="Next officer" className="grid h-11 w-11 place-items-center rounded-full border border-topo/35 bg-white/5 text-topo transition hover:bg-topo hover:text-forest focus:outline-none focus:ring-2 focus:ring-topo focus:ring-offset-2 focus:ring-offset-forest">
          <ChevronRight aria-hidden="true" size={20} />
        </button>
      </div>
      <p className="mt-4 text-center text-xs font-semibold tracking-[.14em] text-emerald-50/55">{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · Use arrow keys or swipe to browse</p>
    </section>
  );
}
