"use client";

/**
 * Formular pentru secțiunea Servicii: titluri + cardurile de
 * catering, autoservire și delivery (texte, avantaje, imagini, butoane).
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { ImageField } from "@/components/dashboard/image-field";
import {
  HelperNote,
  SectionCard,
  SelectField,
  StringListEditor,
  TextAreaField,
  TextField,
  buildIconOptions,
  scrollbarSlim,
  SERVICE_ICON_LABELS,
} from "@/components/dashboard/form-controls";
import type { SectionFormProps } from "@/components/dashboard/form-controls";
import { SERVICE_ICON_OPTIONS } from "@/lib/site-content";
import type { ServiceItem, ServicesContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const SERVICE_ICON_CHOICES = buildIconOptions(SERVICE_ICON_OPTIONS, SERVICE_ICON_LABELS);

const CTA_TYPE_OPTIONS = [
  { value: "anchor", label: "Link intern (secțiune)" },
  { value: "tel", label: "Apel telefonic" },
];

export function ServicesForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<ServicesContent>) {
  const update = (patch: Partial<ServicesContent>) => onChange({ ...value, ...patch });
  const updateService = (id: string, patch: Partial<ServiceItem>) =>
    update({ services: value.services.map((s) => (s.id === id ? { ...s, ...patch } : s)) });

  return (
    <SectionCard
      title="Servicii"
      description="Cardurile de catering, autoservire și delivery."
      headerExtra={headerExtra}
      footer={footer}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Eyebrow (text mic de sus)"
          value={value.eyebrow}
          onChange={(v) => update({ eyebrow: v })}
        />
        <TextField label="Titlu" value={value.title} onChange={(v) => update({ title: v })} />
        <TextField
          label="Accent (cuvânt colorat)"
          value={value.accent}
          onChange={(v) => update({ accent: v })}
        />
        <div className="sm:col-span-2">
          <TextAreaField
            label="Subtitlu"
            rows={2}
            value={value.subtitle}
            onChange={(v) => update({ subtitle: v })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Servicii ({value.services.length})</Label>
        <ul className={cn("max-h-[38rem] space-y-4 overflow-y-auto pr-1", scrollbarSlim)}>
          {value.services.map((service, index) => (
            <li key={service.id}>
              <Card className="gap-5 py-5">
                <CardHeader>
                  <CardTitle className="text-base">Serviciul {index + 1}</CardTitle>
                  <CardDescription>
                    {service.title || "Fără titlu încă"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <TextField
                        label="Numele serviciului"
                        value={service.title}
                        onChange={(v) => updateService(service.id, { title: v })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <TextAreaField
                        label="Descriere"
                        rows={3}
                        value={service.description}
                        onChange={(v) => updateService(service.id, { description: v })}
                      />
                    </div>
                    <TextField
                      label="Insigna din colț"
                      value={service.accent}
                      onChange={(v) => updateService(service.id, { accent: v })}
                      hint="Ex: De la 65 lei / persoană"
                    />
                    <TextField
                      label="Textul butonului"
                      value={service.ctaLabel}
                      onChange={(v) => updateService(service.id, { ctaLabel: v })}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField
                      label="Tipul butonului"
                      value={service.ctaType}
                      onValueChange={(v) =>
                        updateService(service.id, { ctaType: v as ServiceItem["ctaType"] })
                      }
                      options={CTA_TYPE_OPTIONS}
                    />
                    {service.ctaType === "anchor" ? (
                      <TextField
                        label="Adresa linkului intern"
                        value={service.ctaHref}
                        onChange={(v) => updateService(service.id, { ctaHref: v })}
                        placeholder="#contact"
                        hint="Ex: #contact"
                      />
                    ) : (
                      <div className="flex items-end">
                        <HelperNote>
                          Butonul de apel folosește numărul de telefon din secțiunea General.
                        </HelperNote>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      label="Textul mic cu informații"
                      value={service.infoText}
                      onChange={(v) => updateService(service.id, { infoText: v })}
                      hint="Ex: program, zone de livrare"
                    />
                    <SelectField
                      label="Iconița serviciului"
                      value={service.icon}
                      onValueChange={(v) => updateService(service.id, { icon: v })}
                      options={SERVICE_ICON_CHOICES}
                      hint="Iconița din colțul imaginii"
                    />
                  </div>

                  <StringListEditor
                    legend="Avantaje"
                    items={service.features}
                    onChange={(features) => updateService(service.id, { features })}
                    addLabel="Adaugă avantaj"
                    placeholder="Ex: Meniuri personalizate pentru eveniment"
                    itemAriaLabel="avantaj"
                  />

                  <ImageField
                    label="Imaginea serviciului"
                    value={service.image}
                    onChange={(url) => updateService(service.id, { image: url })}
                  />
                  <TextField
                    label="Text alternativ pentru imagine (SEO)"
                    value={service.imageAlt}
                    onChange={(v) => updateService(service.id, { imageAlt: v })}
                  />
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}
