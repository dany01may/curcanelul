"use client";

/**
 * Câmp reutilizabil pentru imagini: previzualizare + încărcare din picker
 * (mobil) sau drag & drop (desktop). Fără buton de ștergere — imaginea
 * poate fi doar înlocuită, ca site-ul să aibă mereu o imagine.
 */

import * as React from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadImageFile, validateImageFile } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";

export function ImageField({
  label,
  value,
  onChange,
  hint,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  compact?: boolean;
}) {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  async function handleFile(file: File | null | undefined) {
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      toast({ variant: "destructive", title: "Imagine invalidă", description: error });
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
      toast({
        title: "Imagine încărcată",
        description: "Amintește-ți să salvezi modificările secțiunii.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Încărcarea a eșuat",
        description: "Nu am putut urca imaginea. Încearcă din nou.",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div
        className={cn(
          "flex gap-3",
          compact ? "items-center" : "flex-col sm:flex-row sm:items-start",
        )}
      >
        <div
          onDragOver={(event) => {
            event.preventDefault();
            if (!uploading) setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            if (!uploading) void handleFile(event.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "relative shrink-0 overflow-hidden rounded-xl border bg-muted/40 transition-all",
            compact ? "h-24 w-32" : "aspect-[4/3] w-full sm:w-64",
            dragActive && "border-primary ring-2 ring-primary/40",
          )}
        >
          {value ? (
            <Image
              src={value}
              alt={label}
              width={480}
              height={360}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Nicio imagine
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col items-start gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-11 sm:h-9"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="size-4" aria-hidden />
            )}
            {uploading ? "Se încarcă..." : "Încarcă imagine"}
          </Button>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label={label}
        disabled={uploading}
        onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
