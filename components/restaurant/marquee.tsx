"use client";

import { Sparkles } from "lucide-react";
import { DEFAULT_CONTENT, type MarqueeContent } from "@/lib/site-content";

export function MarqueeStrip({
  content = DEFAULT_CONTENT.marquee,
}: {
  content?: MarqueeContent;
}) {
  const items = [...content.items, ...content.items];

  return (
    <div
      aria-hidden="true"
      className="relative border-b border-border/60 bg-card/60 py-3 overflow-hidden sm:py-4"
    >
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {items.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.2em] text-foreground/55"
          >
            {text}
            <Sparkles className="size-4 shrink-0 text-primary/70" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
