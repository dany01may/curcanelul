"use client";

/**
 * Formularele „simple” din panou: General, Hero, Bandă promovare,
 * Despre noi, Contact și Footer. Galeria, Serviciile și Meniul au
 * fișiere separate (gallery-form, services-form, menu-form).
 */

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ImageField } from "@/components/dashboard/image-field";
import {
  HelperNote,
  SectionCard,
  StringListEditor,
  TextAreaField,
  TextField,
} from "@/components/dashboard/form-controls";
import type {
  AboutContent,
  ContactContent,
  FooterContent,
  GeneralContent,
  HeroContent,
  MarqueeContent,
} from "@/lib/site-content";
import type { SectionFormProps } from "@/components/dashboard/form-controls";

/* —————————————————————————————— General —————————————————————————————— */

export function GeneralForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<GeneralContent>) {
  const update = (patch: Partial<GeneralContent>) => onChange({ ...value, ...patch });
  const updateHour = (index: number, patch: Partial<GeneralContent["hours"][number]>) =>
    update({
      hours: value.hours.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    });
  const removeHour = (index: number) =>
    update({ hours: value.hours.filter((_, i) => i !== index) });
  const addHour = () => update({ hours: [...value.hours, { days: "", time: "" }] });

  return (
    <SectionCard
      title="General"
      description="Datele de bază ale restaurantului: identificare, contact, logo și program."
      headerExtra={headerExtra}
      footer={footer}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Numele restaurantului"
          value={value.name}
          onChange={(v) => update({ name: v })}
        />
        <TextField
          label="Slogan (tagline)"
          value={value.tagline}
          onChange={(v) => update({ tagline: v })}
        />
        <TextField
          label="Telefon"
          value={value.phone}
          onChange={(v) => update({ phone: v })}
          hint="Format afișat: 0779 265 188"
        />
        <TextField
          label="Email"
          type="email"
          value={value.email}
          onChange={(v) => update({ email: v })}
        />
        <div className="sm:col-span-2">
          <TextField
            label="Adresă completă"
            value={value.address}
            onChange={(v) => update({ address: v })}
          />
        </div>
      </div>

      <ImageField
        label="Logo principal"
        value={value.logo}
        onChange={(url) => update({ logo: url })}
        hint="PNG transparent, apare în navbar, footer și carduri"
      />
      <ImageField
        compact
        label="Mascota din bara de jos (mobil)"
        value={value.bottomBarLogo}
        onChange={(url) => update({ bottomBarLogo: url })}
        hint="PNG transparent — apare lipită, centrată, pe bara de navigare de jos pe telefon"
      />

      <div className="space-y-3">
        <div>
          <Label>Program de funcționare</Label>
          <p className="text-xs text-muted-foreground">
            Apare în navbar, în secțiunea Contact și în footer.
          </p>
        </div>
        {value.hours.length === 0 ? (
          <p className="text-sm text-muted-foreground">Niciun interval adăugat încă.</p>
        ) : (
          <ul className="space-y-2">
            {value.hours.map((row, index) => (
              <li key={index} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  value={row.days}
                  placeholder="Ex: Luni – Vineri"
                  aria-label={`Zile pentru intervalul ${index + 1}`}
                  className="h-11 sm:h-9 sm:flex-1"
                  onChange={(event) => updateHour(index, { days: event.target.value })}
                />
                <Input
                  value={row.time}
                  placeholder="Ex: 08:00 – 16:00"
                  aria-label={`Ore pentru intervalul ${index + 1}`}
                  className="h-11 sm:h-9 sm:w-48"
                  onChange={(event) => updateHour(index, { time: event.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Șterge intervalul ${index + 1}`}
                  className="size-11 shrink-0 text-muted-foreground hover:text-destructive sm:size-9"
                  onClick={() => removeHour(index)}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-11 sm:h-9"
          onClick={addHour}
        >
          <Plus className="size-4" aria-hidden />
          Adaugă interval
        </Button>
      </div>
    </SectionCard>
  );
}

/* —————————————————————————————— Hero —————————————————————————————— */

export function HeroForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<HeroContent>) {
  const update = (patch: Partial<HeroContent>) => onChange({ ...value, ...patch });

  return (
    <SectionCard
      title="Hero"
      description="Prima secțiune vizibilă, cu titlul mare, descrierea și butoanele de acțiune."
      headerExtra={headerExtra}
      footer={footer}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <TextField
            label="Insigna de deasupra titlului"
            value={value.badge}
            onChange={(v) => update({ badge: v })}
          />
        </div>
        <TextField
          label="Titlu — rândul 1"
          value={value.titleTop}
          onChange={(v) => update({ titleTop: v })}
        />
        <TextField
          label="Titlu — accent (word portocaliu)"
          value={value.titleAccent}
          onChange={(v) => update({ titleAccent: v })}
        />
        <div className="sm:col-span-2">
          <TextAreaField
            label="Descriere"
            rows={3}
            value={value.description}
            onChange={(v) => update({ description: v })}
          />
        </div>
        <TextField
          label="Buton principal (text)"
          value={value.primaryCtaLabel}
          onChange={(v) => update({ primaryCtaLabel: v })}
        />
        <TextField
          label="Buton secundar (text)"
          value={value.secondaryCtaLabel}
          onChange={(v) => update({ secondaryCtaLabel: v })}
        />
      </div>

      <ImageField
        label="Imagine de fundal"
        value={value.image}
        onChange={(url) => update({ image: url })}
        hint="Recomandat: orizontală, minim 1600px lățime"
      />
      <TextField
        label="Text alternativ (SEO)"
        value={value.imageAlt}
        onChange={(v) => update({ imageAlt: v })}
      />
    </SectionCard>
  );
}

/* ————————————————————————— Bandă promovare ————————————————————————— */

export function MarqueeForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<MarqueeContent>) {
  const update = (patch: Partial<MarqueeContent>) => onChange({ ...value, ...patch });

  return (
    <SectionCard
      title="Bandă promovare"
      description="Preparatele afișate în banda care scrolează pe site."
      headerExtra={headerExtra}
      footer={footer}
    >
      <StringListEditor
        legend="Preparate în bandă"
        items={value.items}
        onChange={(items) => update({ items })}
        addLabel="Adaugă preparat"
        placeholder="Ex: Sarmale cu smântână"
        hint="Textele scrolează în banda de deasupra secțiunii Servicii."
        itemAriaLabel="preparat"
      />
    </SectionCard>
  );
}

/* —————————————————————————————— Despre noi ————————————————————————————— */

export function AboutForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<AboutContent>) {
  const update = (patch: Partial<AboutContent>) => onChange({ ...value, ...patch });

  return (
    <SectionCard
      title="Despre noi"
      description="Povestea restaurantului: paragrafe, argumente, poze și cardul-badge."
      headerExtra={headerExtra}
      footer={footer}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Eyebrow (text mic de sus)"
          value={value.eyebrow}
          onChange={(v) => update({ eyebrow: v })}
        />
        <TextField
          label="Titlu"
          value={value.title}
          onChange={(v) => update({ title: v })}
        />
        <TextField
          label="Accent (cuvânt colorat)"
          value={value.accent}
          onChange={(v) => update({ accent: v })}
        />
        <TextField
          label="Textul butonului"
          value={value.ctaLabel}
          onChange={(v) => update({ ctaLabel: v })}
        />
      </div>

      <StringListEditor
        legend="Paragrafe"
        items={value.paragraphs}
        onChange={(paragraphs) => update({ paragraphs })}
        addLabel="Adaugă paragraf"
        multiline
        rows={3}
        itemAriaLabel="paragraf"
      />

      <StringListEditor
        legend="Argumente (bifă pe site)"
        items={value.checks}
        onChange={(checks) => update({ checks })}
        addLabel="Adaugă argument"
        placeholder="Ex: Rețete transmise din generație în generație"
        itemAriaLabel="argument"
      />

      <ImageField
        label="Imaginea principală"
        value={value.image}
        onChange={(url) => update({ image: url })}
      />
      <TextField
        label="Text alternativ pentru imaginea principală (SEO)"
        value={value.imageAlt}
        onChange={(v) => update({ imageAlt: v })}
      />
      <ImageField
        compact
        label="Poza suprapună, colț dreapta-jos"
        value={value.overlayImage}
        onChange={(url) => update({ overlayImage: url })}
      />
      <TextField
        label="Text alternativ pentru poza suprapusă (SEO)"
        value={value.overlayImageAlt}
        onChange={(v) => update({ overlayImageAlt: v })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Titlul card-badge"
          value={value.badgeTitle}
          onChange={(v) => update({ badgeTitle: v })}
        />
        <TextField
          label="Subtitlul card-badge"
          value={value.badgeSubtitle}
          onChange={(v) => update({ badgeSubtitle: v })}
        />
      </div>
    </SectionCard>
  );
}

/* —————————————————————————————— Contact —————————————————————————————— */

export function ContactForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<ContactContent>) {
  const update = (patch: Partial<ContactContent>) => onChange({ ...value, ...patch });

  return (
    <SectionCard
      title="Contact"
      description="Harta, butonul de apel și textele din secțiunea de contact."
      headerExtra={headerExtra}
      footer={footer}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Eyebrow (text mic de sus)"
          value={value.eyebrow}
          onChange={(v) => update({ eyebrow: v })}
        />
        <TextField
          label="Titlu"
          value={value.title}
          onChange={(v) => update({ title: v })}
        />
        <TextField
          label="Accent (cuvânt colorat)"
          value={value.accent}
          onChange={(v) => update({ accent: v })}
        />
        <TextField
          label="Textul butonului de apel"
          value={value.ctaLabel}
          onChange={(v) => update({ ctaLabel: v })}
        />
        <div className="sm:col-span-2">
          <TextAreaField
            label="Subtitlu"
            rows={2}
            value={value.subtitle}
            onChange={(v) => update({ subtitle: v })}
          />
        </div>
        <div className="sm:col-span-2">
          <TextAreaField
            label="Textul de sub hartă"
            rows={2}
            value={value.deliveryNote}
            onChange={(v) => update({ deliveryNote: v })}
          />
        </div>
        <TextField
          label="Link hartă embedded (OpenStreetMap/Google)"
          value={value.mapEmbed}
          onChange={(v) => update({ mapEmbed: v })}
        />
        <TextField
          label="Link deschidere în hărți"
          value={value.mapExternal}
          onChange={(v) => update({ mapExternal: v })}
        />
      </div>

      <HelperNote>
        Telefonul, adresa și programul se editează în secțiunea General.
      </HelperNote>
    </SectionCard>
  );
}

/* —————————————————————————————— Footer —————————————————————————————— */

export function FooterForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<FooterContent>) {
  const update = (patch: Partial<FooterContent>) => onChange({ ...value, ...patch });

  return (
    <SectionCard
      title="Footer"
      description="Textele din partea de jos a paginii."
      headerExtra={headerExtra}
      footer={footer}
    >
      <TextAreaField
        label="Descriere"
        rows={2}
        value={value.description}
        onChange={(v) => update({ description: v })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Copyright"
          value={value.copyright}
          onChange={(v) => update({ copyright: v })}
        />
        <TextField
          label="Tagline"
          value={value.tagline}
          onChange={(v) => update({ tagline: v })}
        />
      </div>

      <HelperNote>
        Adresa, telefonul și programul din footer vin din secțiunea General.
      </HelperNote>
    </SectionCard>
  );
}
