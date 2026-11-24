"use client";

import Image from "next/image";
import { useState } from "react";
import { LayoutDashboard, Phone, Menu as MenuIcon, Clock, MapPin } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { DEFAULT_CONTENT, type GeneralContent } from "@/lib/site-content";

const LINKS = [
  { href: "#acasa", label: "Acasă" },
  { href: "#servicii", label: "Servicii" },
  { href: "#meniu", label: "Meniu" },
  { href: "#despre", label: "Despre noi" },
  { href: "#contact", label: "Contact" },
];

function LogoImage({ content }: { content: GeneralContent }) {
  return (
    <span className="relative flex shrink-0 items-center">
      <span
        className="glow-warm animate-glow-pulse absolute -inset-1 rounded-full"
        aria-hidden
      />
      <Image
        src={content.logo}
        alt=""
        width={320}
        height={329}
        priority
        sizes="(max-width: 1024px) 105px, 140px"
        className="relative size-[105px] object-contain drop-shadow-[0_6px_14px_oklch(0.1_0.02_55/0.35)] transition-transform duration-300 group-hover:scale-110 motion-safe:animate-logo-bob lg:size-[140px]"
      />
    </span>
  );
}

export function Navbar({
  content = DEFAULT_CONTENT.general,
}: {
  content?: GeneralContent;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Navigație principală"
        className="relative mx-auto flex h-34 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-44 lg:px-8"
      >
        {/* Buton apel rapid — în stânga logo-ului centrat, doar mobil */}
        <Button
          asChild
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 sm:left-6 sm:hidden"
          aria-label={`Sună la ${content.phone}`}
        >
          <a href={`tel:${content.phone.replace(/\s/g, "")}`}>
            <Phone className="size-5" />
          </a>
        </Button>

        {/* Logo — desktop: poziționat în stânga */}
        <a
          href="#acasa"
          className="group hidden items-center gap-1 lg:flex"
          aria-label={`${content.name} — acasă`}
        >
          <LogoImage content={content} />
        </a>

        {/* Spacer pe mobil, ca logo-ul centrat să aibă spațiu liber în mijloc */}
        <div className="lg:hidden" aria-hidden />

        {/* Logo — mobil/tabletă: centrat pe mijlocul barei de navigare */}
        <a
          href="#acasa"
          className="group absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:hidden"
          aria-label={`${content.name} — acasă`}
        >
          <LogoImage content={content} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-full bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-white shadow-lg shadow-orange-950/40 transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
          >
            <a href="#contact">Delivery</a>
          </Button>

          {/* Panou de administrare — buton discret, doar pentru proprietar.
              Se deschide într-o fereastră/tab nouă de browser, ca pagină dedicată. */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl text-muted-foreground/50 transition-colors hover:bg-secondary hover:text-foreground/80"
          >
            <a
              href="/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Panou de administrare — deschide în fereastră nouă"
              title="Panou de administrare (fereastră nouă)"
            >
              <LayoutDashboard className="size-4.5" />
            </a>
          </Button>

          {/* Meniu bottom-sheet, stil aplicatie */}
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl lg:hidden"
                aria-label="Deschide meniul de navigare"
              >
                <MenuIcon className="size-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="rounded-t-3xl border-border bg-[oklch(1_0_0/0.97)] backdrop-blur-xl">
              <div className="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-foreground/25" />
              <DrawerHeader className="pb-2 pt-3">
                <DrawerTitle className="flex items-center justify-center gap-3 text-xl">
                  <Image
                    src={content.logo}
                    alt=""
                    width={320}
                    height={329}
                    sizes="26px"
                    className="size-6.5 object-contain motion-safe:animate-logo-bob"
                  />
                  <span className="font-brand">{content.name}</span>
                </DrawerTitle>
                <p className="text-center text-xs uppercase tracking-[0.2em] text-primary">
                  {content.tagline}
                </p>
              </DrawerHeader>

              <nav aria-label="Meniu mobil" className="px-5 pt-1">
                <ul className="grid grid-cols-2 gap-2.5">
                  {LINKS.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-12 items-center justify-center rounded-2xl border border-border/60 bg-card/70 px-4 text-base font-semibold text-foreground/90 transition-colors hover:bg-secondary active:scale-95"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <DrawerFooter className="pb-[calc(env(safe-area-inset-bottom)+16px)]">
                <div className="mb-1 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" />
                    {content.hours[0]?.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary" />
                    Bacău
                  </span>
                </div>
                <Button
                  asChild
                  className="h-13 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-base font-bold text-white shadow-xl shadow-orange-950/40 active:scale-95"
                >
                  <a href={`tel:${content.phone.replace(/\s/g, "")}`}>
                    <Phone className="size-5" />
                    Sună acum — {content.phone}
                  </a>
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </nav>
      </header>
    </>
  );
}
