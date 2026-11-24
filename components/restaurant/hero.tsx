"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  ArrowDown,
  Bike,
  ChefHat,
  ConciergeBell,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CONTENT, type HeroContent } from "@/lib/site-content";

const FLOATING = [
  {
    icon: ConciergeBell,
    text: "Catering complet",
    className: "right-[6%] top-[22%] hidden xl:flex animate-float",
    delay: "0s",
  },
  {
    icon: UtensilsCrossed,
    text: "Autoservire zilnică",
    className: "right-[10%] top-[46%] hidden xl:flex animate-float-slow",
    delay: "1.2s",
  },
  {
    icon: Bike,
    text: "Delivery în ~45 min",
    className: "right-[5%] top-[66%] hidden xl:flex animate-float",
    delay: "2s",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function Hero({
  content = DEFAULT_CONTENT.hero,
}: {
  content?: HeroContent;
}) {
  return (
    <section
      id="acasa"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Fundal cu imagine */}
      <Image
        src={content.image}
        alt={content.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(1_0_0/0.78)] via-[oklch(1_0_0/0.45)] to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(1_0_0/0.55)] via-transparent to-[oklch(1_0_0/0.15)]" />

      {/* Glow-uri decorative */}
      <div className="glow-warm animate-glow-pulse absolute -left-32 top-1/4 size-96 rounded-full" />
      <div
        className="glow-warm animate-glow-pulse absolute -right-24 bottom-1/4 size-[28rem] rounded-full"
        style={{ animationDelay: "2.5s" }}
      />

      {/* Chip-uri plutitoare */}
      {FLOATING.map((chip) => (
        <div
          key={chip.text}
          className={`glass absolute z-10 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-xl ${chip.className}`}
          style={{ animationDelay: chip.delay }}
        >
          <chip.icon className="size-4 text-primary" />
          {chip.text}
        </div>
      ))}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-40 sm:px-6 sm:pb-24 sm:pt-44 lg:px-8 lg:pt-52">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.div variants={item} className="flex justify-start">
            <span className="glass inline-flex flex-nowrap items-center gap-x-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[clamp(8px,2.05vw,12px)] font-semibold uppercase leading-none tracking-[0.03em] text-accent sm:px-4 sm:tracking-[0.14em]">
              <ChefHat className="size-3.5 shrink-0 text-primary sm:size-4" />
              {content.badge}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display mt-6 text-[2.6rem] font-extrabold leading-[1.06] [text-shadow:0_2px_24px_oklch(1_0_0/0.75)] sm:text-6xl lg:text-7xl"
          >
            {content.titleTop}
            <br />
            <span className="text-gradient">{content.titleAccent}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/75 [text-shadow:0_1px_16px_oklch(1_0_0/0.7)] sm:mt-6 sm:text-lg"
          >
            {content.description}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="h-14 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-7 text-base font-bold text-white shadow-xl shadow-orange-950/50 transition-transform hover:scale-[1.04] active:scale-95 sm:h-13 sm:w-auto sm:rounded-full"
            >
              <a href="#meniu">
                <UtensilsCrossed className="size-5" />
                {content.primaryCtaLabel}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="glass h-14 w-full rounded-2xl px-7 text-base font-semibold text-foreground hover:bg-secondary/80 active:scale-95 sm:h-13 sm:w-auto sm:rounded-full"
            >
              <a href="#servicii">
                {content.secondaryCtaLabel}
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicator scroll */}
      <motion.a
        href="#servicii"
        aria-label="Derulează în jos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-primary sm:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
          Derulează
        </span>
        <ArrowDown className="size-5 animate-bounce" />
      </motion.a>
    </section>
  );
}
