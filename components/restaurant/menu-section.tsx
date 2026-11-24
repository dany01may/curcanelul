"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import {
  Beef,
  CakeSlice,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  CookingPot,
  Croissant,
  Drumstick,
  Flame,
  Hand,
  IceCreamBowl,
  LayoutGrid,
  Phone,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  UtensilsCrossed,
  Wheat,
  X,
  type LucideIcon,
} from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SectionHeading } from "./section-heading";
import {
  DEFAULT_CONTENT,
  type GeneralContent,
  type MenuContent,
  type MenuItem,
} from "@/lib/site-content";
import { cn } from "@/lib/utils";

/** Preparat + numele categoriei din care face parte */
type Dish = MenuItem & { category: string };

const ICON_BY_NAME: Record<string, LucideIcon> = {
  Salad,
  Soup,
  Drumstick,
  CakeSlice,
  Beef,
  Sandwich,
  CookingPot,
  Croissant,
  Coffee,
  IceCreamBowl,
  Pizza,
  Wheat,
};

type MenuView = "grid" | "swipe";

const VIEW_OPTIONS: { key: MenuView; label: string; icon: LucideIcon }[] = [
  { key: "grid", label: "Grilă", icon: LayoutGrid },
  { key: "swipe", label: "Swipe", icon: Hand },
];

function priceLabel(price: string) {
  return price.trim().length > 0 ? price : "—";
}

export function MenuSection({
  content = DEFAULT_CONTENT.menu,
  general = DEFAULT_CONTENT.general,
}: {
  content?: MenuContent;
  general?: GeneralContent;
}) {
  const [view, setView] = useState<MenuView>("grid");
  const [category, setCategory] = useState<string>("Toate");
  // Fereastra cu detalii preparat (modal)
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  // punctul de start al apăsării — ca să distingem click-ul de gestul de swipe
  const pressPointRef = useRef<{ x: number; y: number } | null>(null);

  // Flatten: toate preparatele, cu numele categoriei atașat
  const dishes = useMemo<Dish[]>(
    () =>
      content.categories.flatMap((cat) =>
        cat.items.map((item) => ({ ...item, category: cat.name }))
      ),
    [content]
  );

  const categoryFilters = useMemo(
    () => ["Toate", ...content.categories.map((c) => c.name)],
    [content]
  );

  // Iconițele per categorie — map direct (nume categorie → componentă iconiță)
  const iconByCategory = useMemo(() => {
    const map: Record<string, LucideIcon> = {};
    for (const cat of content.categories) {
      map[cat.name] = ICON_BY_NAME[cat.icon] ?? UtensilsCrossed;
    }
    return map;
  }, [content]);

  const filtered = useMemo(
    () =>
      category === "Toate"
        ? dishes
        : dishes.filter((d) => d.category === category),
    [category, dishes]
  );

  const countFor = useCallback(
    (c: string) =>
      c === "Toate" ? dishes.length : dishes.filter((d) => d.category === c).length,
    [dishes]
  );

  const openDish = useCallback((dish: Dish) => {
    setSelectedDish(dish);
  }, []);

  // ——— Caruselul (vizualizarea „swipe") ———
  const [emblaRef, api] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pausedRef = useRef(false);
  const interactedRef = useRef(false);
  const [hintVisible, setHintVisible] = useState(true);

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    // starea initiala (index 0) corespunde snap-ului de start al caruselului
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  // Caruselul se reinițializează când se schimbă filtrul de categorii;
  // evenimentul „reInit" (la care suntem abonați) actualizează indexul selectat
  useEffect(() => {
    if (!api) return;
    api.reInit();
  }, [api, filtered]);

  // Autoplay — se oprește la hover / touch și la prima interacțiune a utilizatorului
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (!pausedRef.current) api.scrollNext();
    }, 4200);
    return () => clearInterval(interval);
  }, [api]);

  const markInteracted = useCallback(() => {
    interactedRef.current = true;
    setHintVisible(false);
  }, []);

  const scrollPrev = useCallback(() => {
    markInteracted();
    api?.scrollPrev();
  }, [api, markInteracted]);

  const scrollNext = useCallback(() => {
    markInteracted();
    api?.scrollNext();
  }, [api, markInteracted]);

  const scrollTo = useCallback(
    (index: number) => {
      markInteracted();
      api?.scrollTo(index);
    },
    [api, markInteracted]
  );

  // Distanța circulară pentru efectul de adâncime (cardurile active sunt mai mari)
  const loopDistance = (i: number) => {
    const n = filtered.length;
    const d = Math.abs(i - selectedIndex);
    return Math.min(d, n - d);
  };

  const SelectedIcon = selectedDish
    ? (iconByCategory[selectedDish.category] ?? UtensilsCrossed)
    : null;

  return (
    <section
      id="meniu"
      className="relative scroll-mt-40 overflow-hidden py-20 sm:py-24 lg:scroll-mt-48"
    >
      {/* Glow decorativ */}
      <div className="glow-warm animate-glow-pulse absolute left-1/2 top-16 size-[34rem] -translate-x-1/2 rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          accent={content.accent}
          subtitle={content.subtitle}
        />

        {/* Comutator vizualizare — stil aplicație (Grilă / Swipe) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-8 flex justify-center"
        >
          <div
            className="glass inline-flex items-center rounded-full p-1.5"
            role="tablist"
            aria-label="Mod de afișare al meniului"
          >
            {VIEW_OPTIONS.map((option) => {
              const active = view === option.key;
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setView(option.key)}
                  className={cn(
                    "relative inline-flex min-h-10 items-center rounded-full px-6 text-sm font-bold transition-colors sm:px-7",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="menu-view-pill"
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.5,
                      }}
                      className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/40"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Icon className="size-4" aria-hidden />
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Filtre pe categorii */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="mt-5 -mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
            {categoryFilters.map((c) => {
              const active = category === c;
              const Icon = c === "Toate" ? null : (iconByCategory[c] ?? UtensilsCrossed);
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition-all active:scale-95 sm:px-5 sm:text-sm",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "border-border/60 bg-card/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="size-3.5" aria-hidden />}
                  {c}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      active
                        ? "bg-primary-foreground/20"
                        : "bg-foreground/10 text-foreground/70"
                    )}
                  >
                    {countFor(c)}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {view === "grid" ? (
          /* ——— Vizualizarea GRILĂ ——— */
          <div
            key={`grid-${category}`}
            className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3 xl:grid-cols-4"
            role="list"
            aria-label="Preparate în grilă"
          >
            {filtered.map((dish, i) => (
              <GridCard
                key={dish.id}
                dish={dish}
                index={i}
                categoryIcon={iconByCategory[dish.category] ?? UtensilsCrossed}
                onOpen={() => openDish(dish)}
              />
            ))}
          </div>
        ) : (
          /* ——— Vizualizarea SWIPE (carusel) ——— */
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mt-10"
            onMouseEnter={() => (pausedRef.current = true)}
            onMouseLeave={() => (pausedRef.current = false)}
          >
            <div
              className="cursor-grab select-none overflow-hidden py-4 active:cursor-grabbing"
              ref={emblaRef}
              onTouchStart={markInteracted}
              role="region"
              aria-roledescription="carusel"
              aria-label="Carusel cu preparate din meniu"
            >
              <div className="-ml-4 flex">
                {filtered.map((dish, i) => {
                  const dist = loopDistance(i);
                  const scale = dist === 0 ? 1 : dist === 1 ? 0.94 : 0.88;
                  const opacity = dist === 0 ? 1 : dist === 1 ? 0.72 : 0.45;
                  const CategoryIcon = iconByCategory[dish.category] ?? UtensilsCrossed;

                  return (
                    <div
                      key={dish.id}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} din ${filtered.length}: ${dish.name}`}
                      className="min-w-0 shrink-0 grow-0 basis-[86%] pl-4 sm:basis-[55%] md:basis-[42%] lg:basis-[30%] xl:basis-[24%]"
                    >
                      <article
                        onClick={(e) => {
                          // ignorăm "click"-ul care vine după un gest de swipe
                          const start = pressPointRef.current;
                          pressPointRef.current = null;
                          if (start) {
                            const dist = Math.hypot(
                              e.clientX - start.x,
                              e.clientY - start.y
                            );
                            if (dist > 8) return;
                          }
                          openDish(dish);
                        }}
                        onPointerDown={(e) => {
                          pressPointRef.current = { x: e.clientX, y: e.clientY };
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openDish(dish);
                          }
                        }}
                        tabIndex={0}
                        aria-label={`${dish.name} — apasă pentru detalii și comandă`}
                        className="cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none hover:border-primary/50"
                        style={{ transform: `scale(${scale})`, opacity }}
                      >
                        <div className="relative h-52 sm:h-48">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            sizes="(max-width: 640px) 82vw, 24vw"
                            className="object-cover"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                          <span className="glass absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                            <CategoryIcon className="size-3.5 text-primary" />
                            {dish.category}
                          </span>
                          {dish.popular && (
                            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                              <Flame className="size-3.5" />
                              Popular
                            </span>
                          )}
                        </div>

                        <div className="p-5">
                          <h3 className="font-display text-lg font-bold leading-snug sm:text-xl">
                            {dish.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
                            {dish.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                            <span className="text-xl font-extrabold text-accent">
                              {priceLabel(dish.price)}
                              <span className="ml-1 text-xs font-semibold uppercase text-foreground/60">
                                lei
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() => openDish(dish)}
                              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-secondary px-5 text-sm font-bold text-foreground/85 transition-colors hover:bg-primary hover:text-primary-foreground active:scale-95"
                              aria-label={`Detalii și comandă: ${dish.name}`}
                            >
                              Comandă
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buton navigare stânga — doar desktop (pe mobil se glisează cu degetul) */}
            <button
              onClick={scrollPrev}
              aria-label="Preparatul anterior"
              className="glass absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-110 hover:border-primary/60 sm:flex sm:-left-3 sm:size-12"
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Buton navigare dreapta — doar desktop */}
            <button
              onClick={scrollNext}
              aria-label="Preparatul următor"
              className="glass absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-110 hover:border-primary/60 sm:flex sm:-right-3 sm:size-12"
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Buline de navigare */}
            <div
              className="mt-6 flex items-center justify-center gap-2"
              role="tablist"
              aria-label="Alege preparatul"
            >
              {filtered.map((dish, i) => (
                <button
                  key={dish.id}
                  role="tab"
                  aria-selected={i === selectedIndex}
                  aria-label={dish.name}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "h-3 rounded-full transition-all duration-300 sm:h-2.5",
                    i === selectedIndex
                      ? "w-8 bg-primary shadow-md shadow-primary/40 sm:w-7"
                      : "w-3 bg-foreground/25 hover:bg-foreground/45 sm:w-2.5"
                  )}
                />
              ))}
            </div>

            {/* Indicația de swipe */}
            <div
              className={cn(
                "mt-6 flex items-center justify-center gap-3 text-xs font-medium text-muted-foreground transition-opacity duration-500 sm:mt-8 sm:text-sm",
                hintVisible ? "opacity-100" : "opacity-30"
              )}
            >
              <motion.span
                animate={{ x: [0, -10, 0, 10, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex size-10 items-center justify-center rounded-full border border-border bg-card"
              >
                <Hand className="size-5 text-primary" />
              </motion.span>
              <span>
                Glisează <span className="text-primary font-bold">stânga</span>{" "}
                sau <span className="text-primary font-bold">dreapta</span>{" "}
                pentru mai multe preparate
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* ——— Fereastra cu detalii preparat ——— */}
      <Dialog
        open={!!selectedDish}
        onOpenChange={(open) => {
          if (!open) setSelectedDish(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-h-[92vh] w-full max-w-[calc(100%-1.5rem)] gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-md"
        >
          {selectedDish && (
            <div className="flex flex-col">
              <div className="relative aspect-[16/10] w-full shrink-0">
                <Image
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  fill
                  sizes="(max-width: 640px) 92vw, 448px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                <DialogClose
                  aria-label="Închide fereastra"
                  className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <X className="size-4" />
                </DialogClose>

                <span className="glass absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold">
                  {SelectedIcon && <SelectedIcon className="size-3.5 text-primary" />}
                  {selectedDish.category}
                </span>
                {selectedDish.popular && (
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                    <Flame className="size-3.5" />
                    Popular
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <DialogTitle className="font-display text-2xl font-bold leading-tight">
                  {selectedDish.name}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-relaxed">
                  {selectedDish.description}
                </DialogDescription>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Clock className="size-4 shrink-0 text-primary" />
                  Se comandă telefonic, în timpul programului de funcționare.
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
                  <span className="text-3xl font-extrabold text-accent">
                    {priceLabel(selectedDish.price)}
                    <span className="ml-1 text-sm font-semibold uppercase text-foreground/60">
                      lei
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Preț pe porție
                  </span>
                </div>

                <a
                  href={`tel:${general.phone.replace(/\s/g, "")}`}
                  className="mt-4 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <Phone className="size-5" />
                  Sună pentru comandă — {general.phone}
                </a>
                <p className="mt-2.5 text-center text-[11px] leading-relaxed text-muted-foreground">
                  Atinge butonul ca să suni direct. Preparatele se pot schimba
                  zilnic — întreabă-ne de disponibilitate.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* Card compact pentru vizualizarea în grilă — click deschide fereastra cu detalii */
function GridCard({
  dish,
  index,
  categoryIcon: CategoryIcon,
  onOpen,
}: {
  dish: Dish;
  index: number;
  categoryIcon: LucideIcon;
  onOpen: () => void;
}) {
  return (
    <motion.article
      role="listitem"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      tabIndex={0}
      aria-label={`${dish.name} — apasă pentru detalii și comandă`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg transition-all hover:border-primary/50 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:rounded-3xl"
    >
      <div className="relative h-32 sm:h-40 md:h-44">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
        <span className="glass absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[11px]">
          <CategoryIcon className="size-3 text-primary sm:size-3.5" />
          {dish.category}
        </span>
        {dish.popular && (
          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[11px]">
            <Flame className="size-3 sm:size-3.5" />
            Popular
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="font-display text-sm font-bold leading-snug sm:text-lg">
          {dish.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground sm:mt-2 sm:min-h-10 sm:text-sm">
          {dish.description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3 sm:mt-4 sm:pt-4">
          <span className="text-base font-extrabold text-accent sm:text-xl">
            {priceLabel(dish.price)}
            <span className="ml-1 text-[10px] font-semibold uppercase text-foreground/60 sm:text-xs">
              lei
            </span>
          </span>
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex min-h-9 items-center justify-center rounded-xl bg-secondary px-3 text-xs font-bold text-foreground/85 transition-colors hover:bg-primary hover:text-primary-foreground active:scale-95 sm:min-h-11 sm:px-5 sm:text-sm"
            aria-label={`Detalii și comandă: ${dish.name}`}
          >
            Comandă
          </button>
        </div>
      </div>
    </motion.article>
  );
}
