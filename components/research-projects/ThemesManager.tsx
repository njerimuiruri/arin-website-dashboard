"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Layers, Pencil, Trash2, X } from "lucide-react";

export interface ThemeItem {
    name: string;
    description?: string;
}

interface ThemesManagerProps {
    items: ThemeItem[];
    onChange: (items: ThemeItem[]) => void;
}

const emptyDraft: ThemeItem = { name: "", description: "" };

export default function ThemesManager({ items, onChange }: ThemesManagerProps) {
    const [draft, setDraft] = useState<ThemeItem>(emptyDraft);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleAdd = () => {
        const name = draft.name.trim();
        if (!name) {
            setError("Give the theme a name before adding it.");
            return;
        }
        const duplicate = items.some(
            (item, i) => i !== editingIndex && item.name.trim().toLowerCase() === name.toLowerCase()
        );
        if (duplicate) {
            setError("A theme with this name already exists — pick a different name or edit the existing one.");
            return;
        }

        if (editingIndex !== null) {
            onChange(items.map((item, i) => (i === editingIndex ? { ...draft, name } : item)));
            setEditingIndex(null);
        } else {
            onChange([...items, { ...draft, name }]);
        }
        setDraft(emptyDraft);
        setError(null);
    };

    const handleEdit = (idx: number) => {
        setDraft(items[idx]);
        setEditingIndex(idx);
        setError(null);
    };

    const handleCancelEdit = () => {
        setDraft(emptyDraft);
        setEditingIndex(null);
        setError(null);
    };

    const handleRemove = (idx: number) => {
        onChange(items.filter((_, i) => i !== idx));
        if (editingIndex === idx) handleCancelEdit();
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-slate-500 -mt-2">
                Create a theme here first (e.g. "AI for Climate Resilience"), then select it from a dropdown when adding
                Resources or Abstracts below. Each theme with content gets its own tab on the project page.
            </p>

            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                                editingIndex === idx ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-100"
                            }`}
                        >
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                                {item.description && <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>}
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-amber-700 hover:bg-amber-50 shrink-0" onClick={() => handleEdit(idx)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => handleRemove(idx)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-5 bg-amber-50/60 rounded-lg border-2 border-dashed border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                        {editingIndex !== null ? "Edit theme" : "Add a theme"}
                    </p>
                    {editingIndex !== null && (
                        <button type="button" onClick={handleCancelEdit} className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
                            <X className="h-3.5 w-3.5" /> Cancel edit
                        </button>
                    )}
                </div>

                <Input
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="Theme name, e.g. AI for Climate Resilience"
                    className="h-11 border-2 focus:border-amber-500"
                />
                <Textarea
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Short description shown at the top of this theme's tab (optional)"
                    className="border-2 focus:border-amber-500"
                />

                <div className="flex justify-end">
                    <Button type="button" onClick={handleAdd} className="bg-amber-600 hover:bg-amber-700">
                        {editingIndex !== null ? "Save Changes" : "Add Theme"}
                    </Button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
