"use client";

/**
 * Formular pentru meniu — cel mai important editor: categorii cu
 * iconițe și preparate (nume, descriere, preț, insigna „popular”,
 * imagine, reordonare și ștergere cu confirmare).
 */

import { Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { ImageField } from "@/components/dashboard/image-field";
import {
  ConfirmDeleteDialog,
  MENU_ICON_LABELS,
  ReorderButtons,
  SectionCard,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
  buildIconOptions,
  moveArrayItem,
  scrollbarSlim,
} from "@/components/dashboard/form-controls";
import type { SectionFormProps } from "@/components/dashboard/form-controls";
import { MENU_ICON_OPTIONS } from "@/lib/site-content";
import type { MenuCategory, MenuContent, MenuItem } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const MENU_ICON_CHOICES = buildIconOptions(MENU_ICON_OPTIONS, MENU_ICON_LABELS);

function newItem(): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: "Preparat nou",
    description: "",
    price: "",
    image: "/images/hero.png",
    popular: false,
  };
}

function newCategory(): MenuCategory {
  return {
    id: crypto.randomUUID(),
    name: "Categorie nouă",
    icon: "UtensilsCrossed",
    items: [],
  };
}

export function MenuForm({
  value,
  onChange,
  headerExtra,
  footer,
}: SectionFormProps<MenuContent>) {
  const update = (patch: Partial<MenuContent>) => onChange({ ...value, ...patch });
  const setCategories = (categories: MenuCategory[]) => onChange({ ...value, categories });

  const updateCategory = (id: string, patch: Partial<MenuCategory>) =>
    setCategories(value.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const moveCategory = (index: number, direction: -1 | 1) =>
    setCategories(moveArrayItem(value.categories, index, direction));
  const removeCategory = (id: string) =>
    setCategories(value.categories.filter((c) => c.id !== id));
  const addCategory = () => setCategories([...value.categories, newCategory()]);

  const updateItem = (categoryId: string, itemId: string, patch: Partial<MenuItem>) =>
    setCategories(
      value.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, ...patch } : item,
              ),
            }
          : category,
      ),
    );
  const moveItem = (categoryId: string, index: number, direction: -1 | 1) =>
    setCategories(
      value.categories.map((category) =>
        category.id === categoryId
          ? { ...category, items: moveArrayItem(category.items, index, direction) }
          : category,
      ),
    );
  const removeItem = (categoryId: string, itemId: string) =>
    setCategories(
      value.categories.map((category) =>
        category.id === categoryId
          ? { ...category, items: category.items.filter((item) => item.id !== itemId) }
          : category,
      ),
    );
  const addItem = (categoryId: string) =>
    setCategories(
      value.categories.map((category) =>
        category.id === categoryId ? { ...category, items: [...category.items, newItem()] } : category,
      ),
    );

  return (
    <SectionCard
      title="Meniu"
      description="Categoriile și preparatele din meniul site-ului."
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
        <div>
          <Label>Categorii ({value.categories.length})</Label>
          <p className="text-xs text-muted-foreground">
            Ordinea categoriilor este cea de pe site. Fiecare categorie are propriile preparate.
          </p>
        </div>

        {value.categories.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Meniul nu are categorii. Apasă „Adaugă categorie” ca să începi.
          </p>
        ) : (
          <ul className={cn("max-h-[40rem] space-y-4 overflow-y-auto pr-1", scrollbarSlim)}>
            {value.categories.map((category, index) => (
              <li key={category.id}>
                <Card className="gap-5 py-5">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base">Categoria {index + 1}</CardTitle>
                      <Badge variant="outline" className="text-muted-foreground">
                        {category.items.length}{" "}
                        {category.items.length === 1 ? "preparat" : "preparate"}
                      </Badge>
                      <div className="ml-auto flex gap-1">
                        <ReorderButtons
                          index={index}
                          count={value.categories.length}
                          onMove={(direction) => moveCategory(index, direction)}
                          itemAriaLabel="categoria"
                        />
                        <ConfirmDeleteDialog
                          trigger={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Șterge categoria ${category.name || index + 1}`}
                              className="size-11 text-muted-foreground hover:text-destructive sm:size-9"
                            >
                              <Trash2 className="size-4" aria-hidden />
                            </Button>
                          }
                          title="Ștergi categoria și toate preparatele ei?"
                          description={`Categoria „${category.name || "fără nume"}” și cele ${category.items.length} preparate vor dispărea din meniu după salvare.`}
                          onConfirm={() => removeCategory(category.id)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,14rem)_1fr]">
                      <SelectField
                        label="Iconița categoriei"
                        value={category.icon}
                        onValueChange={(v) => updateCategory(category.id, { icon: v })}
                        options={MENU_ICON_CHOICES}
                      />
                      <TextField
                        label="Numele categoriei"
                        value={category.name}
                        onChange={(v) => updateCategory(category.id, { name: v })}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.items.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Niciun preparat încă.</p>
                    ) : (
                      <ul className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <li
                            key={item.id}
                            className="space-y-3 rounded-xl border border-border bg-muted/20 p-3"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                Preparatul {itemIndex + 1}
                              </span>
                              <div className="ml-auto flex gap-1">
                                <ReorderButtons
                                  index={itemIndex}
                                  count={category.items.length}
                                  onMove={(direction) => moveItem(category.id, itemIndex, direction)}
                                  itemAriaLabel="preparatul"
                                />
                                <ConfirmDeleteDialog
                                  trigger={
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      aria-label={`Șterge preparatul ${item.name || itemIndex + 1}`}
                                      className="size-11 text-muted-foreground hover:text-destructive sm:size-9"
                                    >
                                      <Trash2 className="size-4" aria-hidden />
                                    </Button>
                                  }
                                  title="Ștergi preparatul din meniu?"
                                  description={`„${item.name || "Preparatul"}” va fi eliminat din categoria „${category.name}” după salvare.`}
                                  onConfirm={() => removeItem(category.id, item.id)}
                                />
                              </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[1fr_minmax(0,10rem)]">
                              <TextField
                                label="Nume preparat"
                                value={item.name}
                                onChange={(v) => updateItem(category.id, item.id, { name: v })}
                              />
                              <TextField
                                label="Preț (lei)"
                                value={item.price}
                                onChange={(v) => updateItem(category.id, item.id, { price: v })}
                                placeholder="Ex: 42"
                              />
                            </div>
                            <TextAreaField
                              label="Descriere"
                              rows={2}
                              value={item.description}
                              onChange={(v) => updateItem(category.id, item.id, { description: v })}
                            />
                            <SwitchField
                              label="Preparat popular"
                              checked={item.popular}
                              onChange={(checked) =>
                                updateItem(category.id, item.id, { popular: checked })
                              }
                              hint="Apare cu insigna „Popular” pe site."
                            />
                            <ImageField
                              compact
                              label="Imaginea preparatului"
                              value={item.image}
                              onChange={(url) => updateItem(category.id, item.id, { image: url })}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-11 sm:h-9"
                      onClick={() => addItem(category.id)}
                    >
                      <Plus className="size-4" aria-hidden />
                      Adaugă preparat
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant="outline"
          className="h-11 sm:h-9"
          onClick={addCategory}
        >
          <Plus className="size-4" aria-hidden />
          Adaugă categorie
        </Button>
      </div>
    </SectionCard>
  );
}
