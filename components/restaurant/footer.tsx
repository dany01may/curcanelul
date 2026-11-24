import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";
import {
  DEFAULT_CONTENT,
  type FooterContent,
  type GeneralContent,
} from "@/lib/site-content";

const QUICK_LINKS = [
  { href: "#servicii", label: "Servicii" },
  { href: "#meniu", label: "Meniu" },
  { href: "#despre", label: "Despre noi" },
  { href: "#contact", label: "Contact" },
];

export function Footer({
  content = DEFAULT_CONTENT.footer,
  general = DEFAULT_CONTENT.general,
}: {
  content?: FooterContent;
  general?: GeneralContent;
}) {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 pb-[calc(env(safe-area-inset-bottom)+88px)] pt-10 sm:px-6 md:pb-12 md:pt-12 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#acasa" className="group flex items-center gap-3">
              <Image
                src={general.logo}
                alt=""
                width={320}
                height={329}
                sizes="36px"
                className="size-9 object-contain transition-transform duration-300 group-hover:scale-110 motion-safe:animate-logo-bob"
              />
              <span className="font-brand text-xl">{general.name}</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {content.description}
            </p>
          </div>

          {/* Linkuri rapide — ascunse pe mobil (navigatia e in bara de jos) */}
          <nav
            aria-label="Linkuri rapide"
            className="hidden md:block"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80">
              Navigare
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {general.address}
              </li>
              <li>
                <a
                  href={`tel:${general.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  {general.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Program */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80">
              Program
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {general.hours.map((h) => (
                <li key={h.days} className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <span className="block font-semibold text-foreground/80">
                      {h.days}
                    </span>
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {general.name}. {content.copyright}</p>
          <p className="inline-flex items-center gap-1.5">
            {content.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
