"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ConciergeBell, Home, MapPin, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_CONTENT, type GeneralContent } from "@/lib/site-content";

const NAV_ITEMS = [
  { href: "#acasa", label: "Acasă", icon: Home, id: "acasa" },
  { href: "#servicii", label: "Servicii", icon: ConciergeBell, id: "servicii" },
  { href: "#meniu", label: "Meniu", icon: UtensilsCrossed, id: "meniu" },
  { href: "#contact", label: "Contact", icon: MapPin, id: "contact" },
];

export function MobileNav({
  general = DEFAULT_CONTENT.general,
}: {
  general?: GeneralContent;
}) {
  const [active, setActive] = useState("acasa");

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let current = "acasa";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        // pozitia absoluta in pagina (getBoundingClientRect e relativ la viewport)
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= mid) current = item.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => {
    const isActive = active === item.id;
    return (
      <li key={item.href}>
        <a
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold transition-all duration-300",
            isActive
              ? "text-primary"
              : "text-foreground/55 hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-xl transition-all duration-300",
              isActive &&
                "bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105"
            )}
          >
            <item.icon className="size-5" />
          </span>
          {item.label}
        </a>
      </li>
    );
  };

  return (
    <nav
      aria-label="Navigație mobilă"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-[oklch(1_0_0/0.94)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-2 pt-1.5 pb-1.5">
        {renderItem(NAV_ITEMS[0])}
        {renderItem(NAV_ITEMS[1])}

        {/* Mascota — lipită și centrată pe mijlocul barei de navigare */}
        <li className="flex justify-center">
          <a
            href="#acasa"
            aria-label={`${general.name} — înapoi acasă`}
            className="group relative -mt-4 flex flex-col items-center"
          >
            <span className="flex size-13 items-center justify-center rounded-full border border-border/70 bg-background shadow-lg shadow-orange-900/10 ring-1 ring-background transition-transform duration-300 group-active:scale-90">
              <Image
                src={general.bottomBarLogo}
                alt=""
                width={500}
                height={500}
                sizes="44px"
                className="size-11 object-contain motion-safe:animate-logo-bob"
              />
            </span>
          </a>
        </li>

        {renderItem(NAV_ITEMS[2])}
        {renderItem(NAV_ITEMS[3])}
      </ul>
    </nav>
  );
}
