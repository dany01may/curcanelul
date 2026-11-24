"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import {
  DEFAULT_CONTENT,
  type AboutContent,
  type GeneralContent,
} from "@/lib/site-content";

export function About({
  content = DEFAULT_CONTENT.about,
  general = DEFAULT_CONTENT.general,
}: {
  content?: AboutContent;
  general?: GeneralContent;
}) {
  return (
    <section id="despre" className="relative scroll-mt-40 py-20 sm:py-24 lg:scroll-mt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Imagini cu decor — collage: interior + autoservire */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative pb-12 pr-7 sm:pb-16 sm:pr-10"
          >
            <div className="absolute -inset-3 rounded-[2rem] border-2 border-dashed border-primary/30" />
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={content.image}
                alt={content.imageAlt}
                width={1344}
                height={768}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Poza autoservirii, suprapusă */}
            <div className="absolute bottom-0 right-0 w-[46%] max-w-[280px] -rotate-3 overflow-hidden rounded-2xl border-4 border-background shadow-2xl">
              <Image
                src={content.overlayImage}
                alt={content.overlayImageAlt}
                width={1600}
                height={1200}
                sizes="(max-width: 640px) 46vw, 280px"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>

            {/* Insignă flotantă logo + motto */}
            <div className="glass absolute left-4 top-6 flex items-center gap-2.5 rounded-2xl px-3 py-2.5 shadow-xl sm:-left-6 sm:top-10 sm:px-3.5">
              <Image
                src={general.logo}
                alt=""
                width={320}
                height={329}
                sizes="36px"
                className="size-8 shrink-0 object-contain motion-safe:animate-logo-bob sm:size-9"
              />
              <div className="min-w-0">
                <p className="font-brand text-sm leading-tight sm:text-base">
                  {content.badgeTitle}
                </p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-foreground/65 sm:text-[11px]">
                  {content.badgeSubtitle}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <SectionHeading
              eyebrow={content.eyebrow}
              title={content.title}
              accent={content.accent}
              align="left"
            />
            {content.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 leading-relaxed text-muted-foreground first:mt-6"
              >
                {paragraph}
              </p>
            ))}

            <ul className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-2">
              {content.checks.map((check) => (
                <li key={check} className="flex items-start gap-2.5 text-sm">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-foreground/85">{check}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              className="mt-8 h-14 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-8 text-base font-bold text-white shadow-xl shadow-orange-950/50 transition-transform hover:scale-[1.04] active:scale-95 sm:mt-10 sm:h-13 sm:w-auto sm:rounded-full"
            >
              <a href="#contact">{content.ctaLabel}</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
