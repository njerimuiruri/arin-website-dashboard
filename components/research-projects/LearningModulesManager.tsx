"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, Pencil, Trash2, X } from "lucide-react";

export interface LearningModuleItem {
    title: string;
    description?: string;
    url?: string;
    type?: string;
}

export const LEARNING_MODULE_TYPE_OPTIONS = [
    { value: "reading", label: "Reading" },
    { value: "video", label: "Video" },
    { value: "course", label: "Course" },
    { value: "tool", label: "Tool" },
];

interface LearningModulesManagerProps {
    items: LearningModuleItem[];
    onChange: (items: LearningModuleItem[]) => void;
}

const emptyDraft: LearningModuleItem = { title: "", description: "", url: "", type: "reading" };

export default function LearningModulesManager({ items, onChange }: LearningModulesManagerProps) {
    const [draft, setDraft] = useState<LearningModuleItem>(emptyDraft);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleAdd = () => {
        const title = draft.title.trim();
        if (!title) {
            setError("Give the module a title before adding it.");
            return;
        }

        if (editingIndex !== null) {
            onChange(items.map((item, i) => (i === editingIndex ? { ...draft, title } : item)));
            setEditingIndex(null);
        } else {
            onChange([...items, { ...draft, title }]);
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
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                                editingIndex === idx ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-100"
                            }`}
                        >
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                                {item.description && <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>}
                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                    <span className="inline-block text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
                                        {item.type || "reading"}
                                    </span>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 shrink-0" onClick={() => handleEdit(idx)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => handleRemove(idx)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-5 bg-emerald-50/60 rounded-lg border-2 border-dashed border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                        {editingIndex !== null ? "Edit module" : "Add a learning module"}
                    </p>
                    {editingIndex !== null && (
                        <button type="button" onClick={handleCancelEdit} className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
                            <X className="h-3.5 w-3.5" /> Cancel edit
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        placeholder="Module title, e.g. Intro to Climate Modeling with AI"
                        className="h-11 border-2 focus:border-emerald-500"
                    />
                    <select
                        value={draft.type}
                        onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
                        className="h-11 border-2 focus:border-emerald-500 rounded-md px-3"
                    >
                        {LEARNING_MODULE_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <Textarea
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Short description shown on the module card (optional)"
                    className="border-2 focus:border-emerald-500"
                />

                <Input
                    type="url"
                    value={draft.url}
                    onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                    placeholder="https://... link to the module, video, or course (optional)"
                    className="h-11 border-2 focus:border-emerald-500"
                />

                <div className="flex justify-end">
                    <Button type="button" onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700">
                        {editingIndex !== null ? "Save Changes" : "Add Module"}
                    </Button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
