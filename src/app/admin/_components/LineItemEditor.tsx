"use client";

import { Plus, Trash2 } from "lucide-react";
import { LINE_ITEM_CATEGORIES, RECURRING_INTERVALS } from "@/lib/billing";
import { Select, TextInput } from "./Field";

export interface LineItemDraft {
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  recurring: string;
}

export default function LineItemEditor({
  items,
  onChange,
  currency,
}: {
  items: LineItemDraft[];
  onChange: (items: LineItemDraft[]) => void;
  currency: string;
}) {
  function update(idx: number, patch: Partial<LineItemDraft>) {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }
  function add() {
    onChange([
      ...items,
      {
        description: "",
        category: "CONSULTING",
        quantity: 1,
        unitPrice: 0,
        recurring: "NONE",
      },
    ]);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      <div className="hidden md:grid md:grid-cols-12 gap-2 text-xs uppercase tracking-wide text-white/40 px-2">
        <div className="md:col-span-5">Description</div>
        <div className="md:col-span-2">Category</div>
        <div className="md:col-span-1 text-right">Qty</div>
        <div className="md:col-span-2 text-right">Unit price</div>
        <div className="md:col-span-1">Billing</div>
        <div className="md:col-span-1 text-right">Line total</div>
      </div>

      {items.map((item, idx) => {
        const lineTotal = Number(item.quantity) * Number(item.unitPrice);
        return (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-white/[0.02] rounded-lg p-3"
          >
            <div className="md:col-span-5">
              <TextInput
                placeholder="What is being billed?"
                value={item.description}
                onChange={(e) => update(idx, { description: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Select
                value={item.category}
                onChange={(e) => update(idx, { category: e.target.value })}
              >
                {LINE_ITEM_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-1">
              <TextInput
                type="number"
                min={0}
                step="0.01"
                className="text-right"
                value={String(item.quantity)}
                onChange={(e) =>
                  update(idx, { quantity: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="md:col-span-2">
              <TextInput
                type="number"
                min={0}
                step="0.01"
                className="text-right"
                value={String(item.unitPrice)}
                onChange={(e) =>
                  update(idx, { unitPrice: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="md:col-span-1">
              <Select
                value={item.recurring}
                onChange={(e) => update(idx, { recurring: e.target.value })}
              >
                {RECURRING_INTERVALS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-1 flex items-center justify-end gap-2">
              <span className="text-sm text-white/80 whitespace-nowrap">
                {currency} {lineTotal.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-white/40 hover:text-rose-400 transition-colors"
                aria-label="Remove line"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm text-[#BD2E25] hover:text-[#E85C53]"
      >
        <Plus className="w-4 h-4" />
        Add line item
      </button>
    </div>
  );
}
