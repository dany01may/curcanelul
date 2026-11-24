"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeading } from "@/components/restaurant/section-heading";
import { DEFAULT_CONTENT, type GalleryContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4000;

export function Gallery({
  content = DEFAULT_CONTENT.gallery,
}: {
  content?: GalleryContent;
}) {
  const photos = content.photos;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // sincronizează indicatorul activ cu slide-ul curent
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // derulare automată blândă — se oprește la interacțiune / hover / tab ascuns
  useEffect(() => {
    if (!api || paused) return;
    const id = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [api, paused]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api]
  );

  return (
    <section id="galerie" aria-label="Galerie foto" className="py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          accent={content.accent}
          subtitle={content.subtitle}
        />

        <div
          className="relative mt-10 sm:mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerCancel={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "start", duration: 28 }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 sm:-ml-4">
              {photos.map((photo, index) => (
                <CarouselItem
                  key={photo.id}
                  className="basis-[82%] pl-3 sm:basis-[58%] sm:pl-4 lg:basis-2/5"
                >
                  <figure className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      loading={index < 2 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 58vw, 40vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="glass left-3 size-11 rounded-full border-border/60 text-foreground shadow-lg hover:bg-secondary sm:left-4" />
            <CarouselNext className="glass right-3 size-11 rounded-full border-border/60 text-foreground shadow-lg hover:bg-secondary sm:right-4" />
          </Carousel>

          {/* Indicator slide activ */}
          <div className="mt-7 flex items-center justify-center gap-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Mergi la poza ${index + 1} din galerie`}
                aria-current={index === current}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === current
                    ? "w-7 bg-primary"
                    : "w-2 bg-foreground/20 hover:bg-foreground/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
