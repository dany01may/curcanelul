"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "./section-heading";
import {
  DEFAULT_CONTENT,
  type ContactContent,
  type GeneralContent,
} from "@/lib/site-content";

export function Contact({
  content = DEFAULT_CONTENT.contact,
  general = DEFAULT_CONTENT.general,
}: {
  content?: ContactContent;
  general?: GeneralContent;
}) {
  return (
    <section id="contact" className="relative scroll-mt-40 py-20 sm:py-24 lg:scroll-mt-48">
      <div className="glow-warm animate-glow-pulse absolute -left-24 bottom-10 size-96 rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          accent={content.accent}
          subtitle={content.subtitle}
        />

        <div className="mt-10 grid gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-5 lg:gap-8">
          {/* Carduri de contact */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:gap-4 lg:col-span-2"
          >
            <a
              href={content.mapExternal}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl sm:rounded-3xl sm:p-5"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 transition-colors group-hover:bg-primary/25">
                  <MapPin className="size-5 text-primary" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">Adresă</h3>
                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {general.address}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    Deschide în hărți
                    <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </a>

            <a
              href={`tel:${general.phone.replace(/\s/g, "")}`}
              className="group rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl sm:rounded-3xl sm:p-5"
            >
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 transition-colors group-hover:bg-primary/25">
                  <Phone className="size-5 text-primary" />
                </span>
                <div>
                  <h3 className="font-semibold">Telefon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Contact și comenzi: {general.phone}
                  </p>
                </div>
              </div>
            </a>

            <div className="rounded-2xl border border-border/60 bg-card p-4 sm:rounded-3xl sm:p-5">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
                  <Clock className="size-5 text-primary" />
                </span>
                <div>
                  <h3 className="font-semibold">Program</h3>
                  {general.hours.map((h) => (
                    <p
                      key={h.days}
                      className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground"
                    >
                      <span className="font-semibold text-foreground/75">
                        {h.days}:
                      </span>
                      {h.time}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={`tel:${general.phone.replace(/\s/g, "")}`}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-base font-bold text-white shadow-xl shadow-orange-950/50 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <Phone className="size-5" />
              {content.ctaLabel}
            </a>
          </motion.div>

          {/* Harta */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-3"
          >
            <div className="relative h-[320px] overflow-hidden rounded-3xl border border-border/60 shadow-2xl sm:h-[420px] lg:h-full lg:min-h-[480px]">
              <iframe
                title={`Harta — ${general.name}, ${general.address}`}
                src={content.mapEmbed}
                loading="lazy"
                className="absolute inset-0 size-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Card plutitor cu adresa */}
              <div className="glass-strong pointer-events-none absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl p-4 sm:right-auto sm:max-w-sm">
                <Image
                  src={general.logo}
                  alt=""
                  width={320}
                  height={329}
                  sizes="32px"
                  className="size-8 shrink-0 object-contain motion-safe:animate-logo-bob"
                />
                <div className="min-w-0">
                  <p className="font-brand text-sm sm:text-base">{general.name}</p>
                  <p className="truncate text-xs text-foreground/70 sm:text-sm">
                    {general.address}
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground sm:mt-4 sm:text-sm lg:text-left">
              {content.deliveryNote}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
