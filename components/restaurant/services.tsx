"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  Check,
  ChefHat,
  Clock,
  ConciergeBell,
  HeartHandshake,
  PartyPopper,
  Phone,
  Sparkles,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import {
  DEFAULT_CONTENT,
  type GeneralContent,
  type ServicesContent,
} from "@/lib/site-content";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  ConciergeBell,
  UtensilsCrossed,
  Bike,
  ChefHat,
  Clock,
  Truck,
  PartyPopper,
  Sparkles,
  HeartHandshake,
};

function serviceIcon(name: string): LucideIcon {
  return SERVICE_ICONS[name] ?? ConciergeBell;
}

export function Services({
  content = DEFAULT_CONTENT.services,
  general = DEFAULT_CONTENT.general,
}: {
  content?: ServicesContent;
  general?: GeneralContent;
}) {
  const telHref = `tel:${general.phone.replace(/\s/g, "")}`;

  return (
    <section
      id="servicii"
      className="relative scroll-mt-40 py-16 sm:py-24 lg:scroll-mt-48"
    >
      <div
        className="glow-warm animate-glow-pulse absolute -right-24 top-24 size-96 rounded-full"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          accent={content.accent}
          subtitle={content.subtitle}
        />

        {/* Mobil: carduri stivuite, toate vizibile · Desktop: grilă pe 3 coloane */}
        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-3 lg:gap-8">
          {content.services.map((service, i) => {
            const Icon = serviceIcon(service.icon);
            const href =
              service.ctaType === "tel" ? telHref : service.ctaHref || "#contact";
            const isTel = service.ctaType === "tel";

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl"
              >
                <div className="relative h-48 sm:h-56">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <span className="glass absolute left-4 top-4 flex size-11 items-center justify-center rounded-2xl">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-orange-950/40">
                    {service.accent}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-2xl font-bold">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-foreground/85"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                          <Check
                            className="size-3.5 text-primary"
                            strokeWidth={3}
                          />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-col gap-3 pt-5 sm:pt-6">
                    <span className="inline-flex items-center gap-2 self-start rounded-xl bg-secondary/60 px-3.5 py-2 text-xs font-semibold text-foreground/85">
                      <Icon className="size-4 shrink-0 text-primary" />
                      {service.infoText}
                    </span>
                    <a
                      href={href}
                      aria-label={isTel ? `${service.ctaLabel}: ${general.phone}` : service.ctaLabel}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-secondary/80 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-[0.98]"
                    >
                      {service.ctaLabel}
                      {isTel ? (
                        <Phone className="size-4" />
                      ) : (
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
