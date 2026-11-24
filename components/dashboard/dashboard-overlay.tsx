"use client";

/**
 * Panoul de administrare — overlay pe tot ecranul, cu navigare pe
 * secțiuni, editare per secțiune, semnalizare modificări nesalvate
 * și salvare individuală prin /api/content.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ConciergeBell,
  ExternalLink,
  HeartHandshake,
  Images,
  Loader2,
  LogOut,
  MapPin,
  Megaphone,
  PanelBottom,
  RefreshCw,
  Save,
  Sparkles,
  Store,
  UtensilsCrossed,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  checkAuthStatus,
  deepCloneContent,
  fetchSiteContent,
  logoutDashboard,
  saveContentSection,
  UnauthorizedError,
} from "@/lib/dashboard-api";
import { CONTENT_KEYS } from "@/lib/site-content";
import type { ContentKey, SiteContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { broadcastContentUpdated } from "@/lib/broadcast";

import { AboutForm, ContactForm, FooterForm, GeneralForm, HeroForm, MarqueeForm } from "@/components/dashboard/section-forms";
import { GalleryForm } from "@/components/dashboard/gallery-form";
import { PasswordGate } from "@/components/dashboard/password-gate";
import { ServicesForm } from "@/components/dashboard/services-form";
import { MenuForm } from "@/components/dashboard/menu-form";
import {
  dirtyBadgeClass,
  scrollbarSlim,
} from "@/components/dashboard/form-controls";

/* ——————————————————————— Meta-datele secțiunilor ——————————————————————— */

interface SectionMeta {
  key: ContentKey;
  label: string;
  description: string;
  icon: LucideIcon;
}

const SECTIONS: SectionMeta[] = [
  {
    key: "general",
    label: "General",
    description: "Nume, contact, logo și programul restaurantului.",
    icon: Store,
  },
  {
    key: "hero",
    label: "Hero",
    description: "Secțiunea principală din partea de sus a paginii.",
    icon: Sparkles,
  },
  {
    key: "gallery",
    label: "Galerie",
    description: "Pozele site-ului și descrierile lor pentru SEO.",
    icon: Images,
  },
  {
    key: "marquee",
    label: "Bandă promovare",
    description: "Textele care scrolează deasupra secțiunii Servicii.",
    icon: Megaphone,
  },
  {
    key: "services",
    label: "Servicii",
    description: "Catering, autoservire și delivery.",
    icon: ConciergeBell,
  },
  {
    key: "menu",
    label: "Meniu",
    description: "Categoriile și preparatele din meniu.",
    icon: UtensilsCrossed,
  },
  {
    key: "about",
    label: "Despre noi",
    description: "Povestea restaurantului, pozele și argumentele.",
    icon: HeartHandshake,
  },
  {
    key: "contact",
    label: "Contact",
    description: "Harta, butonul de apel și textele de contact.",
    icon: MapPin,
  },
  {
    key: "footer",
    label: "Footer",
    description: "Textele din partea de jos a paginii.",
    icon: PanelBottom,
  },
];

function sectionLabel(key: ContentKey): string {
  return SECTIONS.find((section) => section.key === key)?.label ?? key;
}

/* ————————————————————— Stări auxiliare de randare ————————————————————— */

function LoadingState() {
  return (
    <div className="space-y-6" aria-label="Se încarcă conținutul panoului">
      <Skeleton className="h-10 w-1/3 rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

function ErrorState({ onRetry, loading }: { onRetry: () => void; loading: boolean }) {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="size-6 text-destructive" aria-hidden />
        </div>
        <div className="space-y-1">
          <p className="font-semibold">Încărcarea conținutului a eșuat</p>
          <p className="text-sm text-muted-foreground">
            Verifică conexiunea la internet, apoi încearcă din nou.
          </p>
        </div>
        <Button type="button" className="h-11 sm:h-9" onClick={onRetry} disabled={loading}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="size-4" aria-hidden />
          )}
          Încearcă din nou
        </Button>
      </CardContent>
    </Card>
  );
}

/* ————————————————————————————— Componenta principală ————————————————————————————— */

export function DashboardOverlay({
  open,
  onOpenChange,
  mode = "overlay",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "overlay" = peste pagina publică · "page" = pagină dedicată (/dashboard) */
  mode?: "overlay" | "page";
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [saved, setSaved] = React.useState<SiteContent | null>(null);
  const [draft, setDraft] = React.useState<SiteContent | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);
  const [locked, setLocked] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<ContentKey>("general");
  const [savingKey, setSavingKey] = React.useState<ContentKey | null>(null);

  const loadContent = React.useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const content = await fetchSiteContent();
      setSaved(content);
      setDraft(deepCloneContent(content));
      setLocked(false);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        // Sesiune lipsă / expirată — revenim la ecranul de parolă.
        setSaved(null);
        setDraft(null);
        setLocked(true);
      } else {
        setLoadError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // La fiecare deschidere verificăm sesiunea, apoi încărcăm conținutul.
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setLoadError(false);
      const authed = await checkAuthStatus();
      if (cancelled) return;
      if (!authed) {
        setSaved(null);
        setDraft(null);
        setLocked(true);
        setLoading(false);
        return;
      }
      if (!cancelled) void loadContent();
    })();

    return () => {
      cancelled = true;
    };
  }, [open, loadContent]);

  // Blochează scroll-ul paginii de sub overlay, cât timp e deschis.
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape închide panoul doar în modul overlay (nu în timp ce un dialog Radix
  // e deschis). În modul "page" (tab dedicat) Escape nu închide fereastra.
  React.useEffect(() => {
    if (!open || mode !== "overlay") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const dialogEl = document.querySelector(
        '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]',
      );
      if (dialogEl) return;
      onOpenChange(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, mode, onOpenChange]);

  if (!open) return null;

  // Panoul e blocat — arătăm doar ecranul de deblocare cu parolă.
  if (locked) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panou de administrare — deblocare"
        className="fixed inset-0 z-[70] flex flex-col bg-background"
      >
        <PasswordGate
          onUnlocked={() => {
            setLocked(false);
            void loadContent();
          }}
          onClose={() => onOpenChange(false)}
        />
      </div>
    );
  }

  function isSectionDirty(key: ContentKey): boolean {
    if (!draft || !saved) return false;
    return JSON.stringify(draft[key]) !== JSON.stringify(saved[key]);
  }

  function patchSection<K extends ContentKey>(key: K, value: SiteContent[K]) {
    setDraft((prev) => (prev ? ({ ...prev, [key]: value } as SiteContent) : prev));
  }

  async function saveSection(key: ContentKey) {
    if (!draft) return;
    const sectionValue = draft[key];
    setSavingKey(key);
    try {
      await saveContentSection(key, sectionValue);
      setSaved((prev) => (prev ? ({ ...prev, [key]: sectionValue } as SiteContent) : prev));
      toast({
        title: "Modificări salvate",
        description:
          mode === "page"
            ? `Secțiunea „${sectionLabel(key)}” a fost actualizată. Site-ul din celălalt tab se reîmprospătează automat.`
            : `Secțiunea „${sectionLabel(key)}” a fost actualizată.`,
      });
      router.refresh();
      // Anunță și celelalte tab-uri (ex. tab-ul cu site-ul public) despre update.
      broadcastContentUpdated();
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setSaved(null);
        setDraft(null);
        setLocked(true);
        toast({
          variant: "destructive",
          title: "Sesiune expirată",
          description: "Introdu parola din nou ca să continui editarea.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Salvarea a eșuat",
          description: "Verifică conexiunea la internet și încearcă din nou.",
        });
      }
    } finally {
      setSavingKey(null);
    }
  }

  async function handleLogout() {
    await logoutDashboard();
    setSaved(null);
    setDraft(null);
    setActiveSection("general");
    setLocked(true);
  }

  function renderSection(key: ContentKey): React.ReactNode {
    if (!draft) return null;
    const dirty = isSectionDirty(key);
    const headerExtra = dirty ? (
      <Badge className={dirtyBadgeClass}>Nesalvat</Badge>
    ) : null;
    const footer = (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          După salvare, modificările apar imediat pe site.
        </p>
        <Button
          type="button"
          className="h-11 w-full sm:h-9 sm:w-auto"
          onClick={() => void saveSection(key)}
          disabled={!dirty || savingKey === key}
        >
          {savingKey === key ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          Salvează modificările
        </Button>
      </div>
    );
    const shared = { general: draft.general, headerExtra, footer };

    switch (key) {
      case "general":
        return (
          <GeneralForm
            value={draft.general}
            onChange={(v) => patchSection("general", v)}
            {...shared}
          />
        );
      case "hero":
        return (
          <HeroForm
            value={draft.hero}
            onChange={(v) => patchSection("hero", v)}
            {...shared}
          />
        );
      case "gallery":
        return (
          <GalleryForm
            value={draft.gallery}
            onChange={(v) => patchSection("gallery", v)}
            {...shared}
          />
        );
      case "marquee":
        return (
          <MarqueeForm
            value={draft.marquee}
            onChange={(v) => patchSection("marquee", v)}
            {...shared}
          />
        );
      case "services":
        return (
          <ServicesForm
            value={draft.services}
            onChange={(v) => patchSection("services", v)}
            {...shared}
          />
        );
      case "menu":
        return (
          <MenuForm
            value={draft.menu}
            onChange={(v) => patchSection("menu", v)}
            {...shared}
          />
        );
      case "about":
        return (
          <AboutForm
            value={draft.about}
            onChange={(v) => patchSection("about", v)}
            {...shared}
          />
        );
      case "contact":
        return (
          <ContactForm
            value={draft.contact}
            onChange={(v) => patchSection("contact", v)}
            {...shared}
          />
        );
      case "footer":
        return (
          <FooterForm
            value={draft.footer}
            onChange={(v) => patchSection("footer", v)}
            {...shared}
          />
        );
      default:
        return null;
    }
  }

  const anyDirty = CONTENT_KEYS.some((key) => isSectionDirty(key));
  const showContent = !loading && !loadError && draft !== null;
  const isPageMode = mode === "page";

  return (
    <div
      {...(isPageMode
        ? { "aria-label": "Panou de administrare" }
        : {
            role: "dialog",
            "aria-modal": true,
            "aria-label": "Panou de administrare",
          })}
      className="fixed inset-0 z-[70] flex flex-col bg-background"
    >
      {/* Antet fix */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold">Panou de administrare</h1>
          <p className="text-xs text-muted-foreground">Editează conținutul site-ului</p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {anyDirty ? (
            <Badge className={cn(dirtyBadgeClass, "gap-1.5")}>
              <span className="size-1.5 rounded-full bg-amber-500" aria-hidden />
              Modificări nesalvate
            </Badge>
          ) : null}
          {showContent ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void handleLogout()}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              aria-label="Ieși din panoul de administrare"
            >
              <LogOut className="size-4" aria-hidden />
              <span className="hidden sm:inline">Ieșire</span>
            </Button>
          ) : null}
          {mode === "overlay" ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11 sm:size-9"
              onClick={() => window.open("/dashboard", "_blank", "noopener")}
              aria-label="Deschide panoul în fereastră nouă"
              title="Deschide panoul în fereastră nouă"
            >
              <ExternalLink className="size-4.5" aria-hidden />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11 sm:size-9"
              onClick={() => window.open("/", "_blank", "noopener")}
              aria-label="Vezi site-ul public într-un tab nou"
              title="Vezi site-ul public"
            >
              <ExternalLink className="size-4.5" aria-hidden />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              mode === "page"
                ? "Închide panoul de administrare"
                : "Închide panoul de administrare"
            }
            title={mode === "page" ? "Închide fereastra" : "Închide"}
            className="size-11 sm:size-9"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-5" aria-hidden />
          </Button>
        </div>
      </header>

      {/* Navigație pe pilule, doar pe mobil */}
      <nav
        aria-label="Secțiunile panoului de administrare"
        className="border-b border-border bg-background/80 backdrop-blur lg:hidden"
      >
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((section) => {
            const isActive = section.key === activeSection;
            const sectionDirty = isSectionDirty(section.key);
            return (
              <button
                key={section.key}
                type="button"
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActiveSection(section.key)}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
                  isActive
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <section.icon className="size-4" aria-hidden />
                {section.label}
                {sectionDirty ? (
                  <span
                    aria-label="cu modificări nesalvate"
                    className="size-2 shrink-0 rounded-full bg-amber-500"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Bară laterală, doar pe desktop */}
        <aside className="hidden w-60 shrink-0 border-r border-border bg-card/50 lg:block">
          <nav
            aria-label="Secțiunile panoului de administrare"
            className={cn("h-full space-y-1 overflow-y-auto p-3", scrollbarSlim)}
          >
            {SECTIONS.map((section) => {
              const isActive = section.key === activeSection;
              const dirty = isSectionDirty(section.key);
              return (
                <button
                  key={section.key}
                  type="button"
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActiveSection(section.key)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <section.icon className="size-4 shrink-0" aria-hidden />
                  <span className="flex-1 truncate text-left">{section.label}</span>
                  {dirty ? (
                    <span
                      aria-label="Secțiune cu modificări nesalvate"
                      className="size-1.5 shrink-0 rounded-full bg-amber-500"
                    />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Zona de conținut */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
            {loading ? <LoadingState /> : null}
            {!loading && loadError ? (
              <ErrorState onRetry={() => void loadContent()} loading={loading} />
            ) : null}
            {showContent ? renderSection(activeSection) : null}
          </div>
        </main>
      </div>

      {/* Bară de salvare lipită de jos — mereu vizibilă când secțiunea activă are
          modificări nesalvate (rezolvă problema butonului de sub „fold” pe mobil). */}
      {showContent && isSectionDirty(activeSection) ? (
        <div
          role="status"
          className="z-20 border-t border-border bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/85"
        >
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm font-medium">
              <span className="size-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
              Modificări nesalvate în „{sectionLabel(activeSection)}”
            </p>
            <Button
              type="button"
              onClick={() => void saveSection(activeSection)}
              disabled={savingKey === activeSection}
              className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 font-bold text-white shadow-lg shadow-orange-500/25 active:scale-95"
            >
              {savingKey === activeSection ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Save className="size-4" aria-hidden />
              )}
              Salvează acum
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
