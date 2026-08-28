"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X } from "lucide-react";

export interface KeyValueField {
    name: string;
    label: string;
    placeholder?: string;
    multiline?: boolean;
    required?: boolean;
}

type Row = Record<string, string>;

interface KeyValueListManagerProps {
    items: Row[];
    onChange: (items: Row[]) => void;
    fields: [KeyValueField, KeyValueField];
    addLabel?: string;
}

// Small two-field repeater used for a sub-project's headline stats
// ({ label, value }) and its "mode of study" list ({ title, description }).
export default function KeyValueListManager({ items, onChange, fields, addLabel = "Add" }: KeyValueListManagerProps) {
    const emptyDraft: Row = { [fields[0].name]: "", [fields[1].name]: "" };
    const [draft, setDraft] = useState<Row>(emptyDraft);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const isValid = () =>
        fields.every((f) => (f.required === false ? true : Boolean((draft[f.name] || "").trim())));

    const handleAdd = () => {
        if (!isValid()) {
            setError("Fill in the required fields before adding.");
            return;
        }
        const cleaned: Row = {};
        fields.forEach((f) => { cleaned[f.name] = (draft[f.name] || "").trim(); });
        if (editingIndex !== null) {
            onChange(items.map((it, i) => (i === editingIndex ? cleaned : it)));
            setEditingIndex(null);
        } else {
            onChange([...items, cleaned]);
        }
        setDraft(emptyDraft);
        setError(null);
    };

    const handleEdit = (idx: number) => {
        setDraft({ ...emptyDraft, ...items[idx] });
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
            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((row, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                                editingIndex === idx ? "bg-blue-50 border-blue-300" : "bg-slate-50 border-slate-100"
                            }`}
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800">{row[fields[0].name]}</p>
                                {row[fields[1].name] && (
                                    <p className="text-sm text-slate-500 mt-0.5">{row[fields[1].name]}</p>
                                )}
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-blue-700 hover:bg-blue-50 shrink-0" onClick={() => handleEdit(idx)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => handleRemove(idx)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-5 bg-blue-50/60 rounded-lg border-2 border-dashed border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                        {editingIndex !== null ? "Edit entry" : addLabel}
                    </p>
                    {editingIndex !== null && (
                        <button type="button" onClick={handleCancelEdit} className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
                            <X className="h-3.5 w-3.5" /> Cancel edit
                        </button>
                    )}
                </div>

                {fields.map((f) =>
                    f.multiline ? (
                        <Textarea
                            key={f.name}
                            value={draft[f.name] || ""}
                            onChange={(e) => setDraft((d) => ({ ...d, [f.name]: e.target.value }))}
                            placeholder={f.placeholder || f.label}
                            className="border-2 focus:border-blue-500"
                        />
                    ) : (
                        <Input
                            key={f.name}
                            value={draft[f.name] || ""}
                            onChange={(e) => setDraft((d) => ({ ...d, [f.name]: e.target.value }))}
                            placeholder={f.placeholder || f.label}
                            className="h-11 border-2 focus:border-blue-500"
                        />
                    )
                )}

                <div className="flex justify-end">
                    <Button type="button" onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                        {editingIndex !== null ? "Save Changes" : addLabel}
                    </Button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
