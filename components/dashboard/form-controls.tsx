"use client";

/**
 * Building blocks reutilizabile pentru formularele din panoul de administrare.
 */

import * as React from "react";
import { ChevronDown, ChevronUp, Info, Plus, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { GeneralContent } from "@/lib/site-content";

/* ————————————————————————— Stiluri & utilitare ————————————————————————— */

/** Scrollbar subțire, discret, pentru listele lungi. */
export const scrollbarSlim =
  "[scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40";

/** Insignă „Nesalvat” — chihlimbar, nu albastru. */
export const dirtyBadgeClass = "border-transparent bg-amber-100 text-amber-800";

/** Mută un element din listă cu o poziție sus (-1) sau jos (1). */
export function moveArrayItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (index < 0 || index >= items.length || target < 0 || target >= items.length) {
    return items;
  }
  const next = [...items];
  const current = next[index];
  next[index] = next[target];
  next[target] = current;
  return next;
}

/* ———————————————————————— Contract pentru formulare ——————————————————————— */

export interface SectionFormProps<T> {
  /** Secțiunea de conținut editată (doar slice-ul acestei forme). */
  value: T;
  /** Înlocuiește integral obiectul secțiunii (patch imutabil). */
  onChange: (next: T) => void;
  /** Conținutul curent al secțiunii General (util pentru indicii). */
  general: GeneralContent;
  /** Randat lângă titlu, ex. insigna „Nesalvat”. */
  headerExtra?: React.ReactNode;
  /** Randat la finalul cardului, ex. rândul de salvare. */
  footer?: React.ReactNode;
}

/* ————————————————————————————— Card de secțiune ————————————————————————————— */

export function SectionCard({
  title,
  description,
  headerExtra,
  footer,
  children,
}: {
  title: string;
  description: string;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {headerExtra}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {children}
        {footer ? <div className="border-t border-border pt-5">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}

/* ——————————————————————————————— Câmpuri simple ——————————————————————————————— */

function FieldShell({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
}) {
  const id = React.useId();
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        className="h-11 sm:h-9"
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  rows?: number;
}) {
  const id = React.useId();
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
  placeholder?: string;
}) {
  const id = React.useId();
  const valueMissing = value.length > 0 && !options.some((option) => option.value === value);
  const allOptions = valueMissing ? [{ value, label: value }, ...options] : options;
  return (
    <FieldShell label={label} hint={hint} htmlFor={id}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="h-11 w-full sm:h-9">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {allOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  const id = React.useId();
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-4 py-2">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

/** Notă discretă de ajutor, cu iconiță de informație. */
export function HelperNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/* ——————————————————————— Editor de liste de șiruri ——————————————————————— */

export function StringListEditor({
  legend,
  items,
  onChange,
  addLabel,
  hint,
  placeholder,
  multiline = false,
  rows = 3,
  itemAriaLabel = "element",
}: {
  legend: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  itemAriaLabel?: string;
}) {
  const update = (index: number, value: string) =>
    onChange(items.map((item, i) => (i === index ? value : item)));
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <Label>{legend}</Label>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Niciun element adăugat încă.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              {multiline ? (
                <Textarea
                  rows={rows}
                  value={item}
                  placeholder={placeholder}
                  aria-label={`${itemAriaLabel} ${index + 1}`}
                  onChange={(event) => update(index, event.target.value)}
                />
              ) : (
                <Input
                  value={item}
                  placeholder={placeholder}
                  aria-label={`${itemAriaLabel} ${index + 1}`}
                  className="h-11 sm:h-9"
                  onChange={(event) => update(index, event.target.value)}
                />
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Șterge ${itemAriaLabel} ${index + 1}`}
                className="size-11 shrink-0 text-muted-foreground hover:text-destructive sm:size-9"
                onClick={() => remove(index)}
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
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="size-4" aria-hidden />
        {addLabel}
      </Button>
    </div>
  );
}

/* ——————————————————————— Butonare de reordonare ——————————————————————— */

export function ReorderButtons({
  index,
  count,
  onMove,
  itemAriaLabel,
}: {
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  itemAriaLabel: string;
}) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Mută ${itemAriaLabel} mai sus`}
        disabled={index === 0}
        className="size-11 text-muted-foreground hover:text-foreground sm:size-9"
        onClick={() => onMove(-1)}
      >
        <ChevronUp className="size-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Mută ${itemAriaLabel} mai jos`}
        disabled={index === count - 1}
        className="size-11 text-muted-foreground hover:text-foreground sm:size-9"
        onClick={() => onMove(1)}
      >
        <ChevronDown className="size-4" aria-hidden />
      </Button>
    </>
  );
}

/* ——————————————————————— Dialog de confirmare ștergere ——————————————————————— */

export function ConfirmDeleteDialog({
  trigger,
  title,
  description,
  onConfirm,
  confirmLabel = "Șterge",
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ————————————————————— Etichete prietenoase pentru iconițe ————————————————————— */

export const MENU_ICON_LABELS: Record<string, string> = {
  Salad: "Salate",
  Soup: "Ciorbe",
  Drumstick: "Carne și grătar",
  CakeSlice: "Deserturi",
  Beef: "Fripturi",
  Sandwich: "Sandvișuri",
  CookingPot: "Tocănițe",
  Croissant: "Patiserie",
  Coffee: "Cafenea",
  IceCreamBowl: "Înghețată",
  Pizza: "Pizza",
  Wheat: "Garnituri",
};

export const SERVICE_ICON_LABELS: Record<string, string> = {
  ConciergeBell: "Catering",
  UtensilsCrossed: "Restaurant",
  Bike: "Curier",
  ChefHat: "Bucătar",
  Clock: "Program",
  Truck: "Livrare",
  PartyPopper: "Evenimente",
  Sparkles: "Extra",
  HeartHandshake: "Ospitalitate",
};

export function buildIconOptions(
  options: readonly string[],
  labels: Record<string, string>,
): { value: string; label: string }[] {
  return options.map((value) => ({ value, label: labels[value] ?? value }));
}
