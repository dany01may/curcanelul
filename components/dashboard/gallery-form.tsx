"use client";

/**
 * Formular pentru galerie: titlurile secțiunii + managerul de poze
 * (încărcare, descrieri SEO, reordonare, ștergere cu confirmare).
 */

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {
  ConfirmDeleteDialog,
  ReorderButtons,
  SectionCard,
  TextAreaField,
  TextField,
  dirtyBadgeClass,
  moveArrayItem,
  scrollbarSlim,
} from "@/components/dashboard/form-controls";
import type { SectionFormProps } from "@/components/dashboard/form-controls";
import { uploadImageFile, validateImageFile } from "@/lib/dashboard-api";
import type { GalleryContent, GalleryPhoto } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function GalleryForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<GalleryContent>) {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [showUploader, setShowUploader] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const inputId = React.useId();

  // Referință mereu actualizată, ca pozele adăugate în timpul încărcării
  // să nu piardă editările făcute între timp.
  const photosRef = React.useRef(value.photos);
  React.useEffect(() => {
    photosRef.current = value.photos;
  }, [value.photos]);

  const setPhotos = (photos: GalleryPhoto[]) => onChange({ ...value, photos });
  const updatePhoto = (id: string, patch: Partial<GalleryPhoto>) =>
    setPhotos(value.photos.map((photo) => (photo.id === id ? { ...photo, ...patch } : photo)));
  const movePhoto = (index: number, direction: -1 | 1) =>
    setPhotos(moveArrayItem(value.photos, index, direction));
  const removePhoto = (id: string) => setPhotos(value.photos.filter((photo) => photo.id !== id));

  const update = (patch: Partial<GalleryContent>) => onChange({ ...value, ...patch });

  async function handleFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;
    for (const file of files) {
      const error = validateImageFile(file);
      if (error) {
        toast({
          variant: "destructive",
          title: "Imagine invalidă",
          description: `${file.name}: ${error}`,
        });
        return;
      }
    }
    setUploading(true);
    try {
      const added: GalleryPhoto[] = [];
      for (const file of files) {
        const url = await uploadImageFile(file);
        added.push({ id: crypto.randomUUID(), src: url, alt: "" });
      }
      setPhotos([...photosRef.current, ...added]);
      setShowUploader(false);
      toast({
        title: "Poze încărcate",
        description:
          files.length === 1
            ? "Poză a fost adăugată în galerie. Salvează modificările pentru a o publica."
            : `${files.length} poze au fost adăugate în galerie. Salvează modificările pentru a le publica.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Încărcarea a eșuat",
        description: "Nu am putut urca pozele. Verifică conexiunea și încearcă din nou.",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <SectionCard
      title="Galerie"
      description="Titlurile secțiunii și pozele cu preparate și interior."
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
        <div className="flex items-end justify-between gap-3">
          <div>
            <Label>Poze ({value.photos.length})</Label>
            <p className="text-xs text-muted-foreground">
              Scrie o descriere pentru fiecare poză și reordonează cu săgețile.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11 shrink-0 sm:h-9"
            onClick={() => setShowUploader((open) => !open)}
            aria-expanded={showUploader}
          >
            <Plus className="size-4" aria-hidden />
            Adaugă poză
          </Button>
        </div>

        {showUploader ? (
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault();
              if (!uploading) setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragActive(false);
              if (!uploading) void handleFiles(event.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50",
              dragActive && "border-primary bg-primary/5 ring-2 ring-primary/30",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="size-5" aria-hidden />
            )}
            <span className="font-medium text-foreground">
              {uploading ? "Se încarcă pozele..." : "Apasă sau trage poze aici"}
            </span>
            <span className="text-xs">PNG, JPG sau WebP · maxim 5 MB fiecare</span>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={uploading}
              onChange={(event) => void handleFiles(event.target.files)}
            />
          </label>
        ) : null}

        {value.photos.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Galeria este goală. Apasă „Adaugă poză” pentru prima fotografie.
          </p>
        ) : (
          <ul
            className={cn(
              "grid max-h-[28rem] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3",
              scrollbarSlim,
            )}
          >
            {value.photos.map((photo, index) => (
              <li key={photo.id} className="space-y-2 rounded-xl border border-border bg-card p-2.5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted/40">
                  <Image
                    src={photo.src}
                    alt={photo.alt || "Poză din galerie"}
                    width={480}
                    height={360}
                    className="h-full w-full object-cover"
                  />
                </div>
                {photo.alt.trim().length === 0 ? (
                  <Badge className={cn("w-full justify-center", dirtyBadgeClass)}>
                    Fără descriere
                  </Badge>
                ) : null}
                <TextField
                  label="Descriere (SEO)"
                  value={photo.alt}
                  onChange={(v) => updatePhoto(photo.id, { alt: v })}
                />
                <div className="flex items-center gap-1">
                  <ReorderButtons
                    index={index}
                    count={value.photos.length}
                    onMove={(direction) => movePhoto(index, direction)}
                    itemAriaLabel={`poza ${index + 1}`}
                  />
                  <span className="flex-1" />
                  <ConfirmDeleteDialog
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Șterge poza ${index + 1}`}
                        className="size-11 text-muted-foreground hover:text-destructive sm:size-9"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    }
                    title="Ștergi definitiv poza din galerie?"
                    description="Poza va dispărea de pe site imediat după salvarea secțiunii."
                    onConfirm={() => removePhoto(photo.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionCard>
  );
}
