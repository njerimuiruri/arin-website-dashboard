"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Award, GraduationCap, Pencil, Trash2, X } from "lucide-react";
import TagListEditor from "./TagListEditor";

export interface SubProjectLevelItem {
    name: string;
    subtitle?: string;
    description?: string;
    points?: string[];
    certificate?: string;
}

interface SubProjectLevelsManagerProps {
    items: SubProjectLevelItem[];
    onChange: (items: SubProjectLevelItem[]) => void;
}

const emptyDraft: SubProjectLevelItem = { name: "", subtitle: "", description: "", points: [], certificate: "" };

// Repeater for a fellowship/programme's tiers (Beginner / Intermediate / Advanced),
// each with its own assessment bullets and certificate.
export default function SubProjectLevelsManager({ items, onChange }: SubProjectLevelsManagerProps) {
    const [draft, setDraft] = useState<SubProjectLevelItem>(emptyDraft);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAdd = () => {
        const name = (draft.name || "").trim();
        if (!name) {
            setError("Give the level a name (e.g. Beginner).");
            return;
        }
        const cleaned: SubProjectLevelItem = {
            name,
            subtitle: (draft.subtitle || "").trim(),
            description: (draft.description || "").trim(),
            points: draft.points || [],
            certificate: (draft.certificate || "").trim(),
        };
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
        setDraft({ ...emptyDraft, ...items[idx], points: items[idx].points || [] });
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
                    {items.map((lvl, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                                editingIndex === idx ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-100"
                            }`}
                        >
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800">
                                    {lvl.name}
                                    {lvl.subtitle ? <span className="text-slate-500 font-normal"> — {lvl.subtitle}</span> : null}
                                </p>
                                {lvl.description && <p className="text-sm text-slate-500 mt-0.5">{lvl.description}</p>}
                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                    {(lvl.points?.length || 0) > 0 && (
                                        <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                            {lvl.points!.length} point{lvl.points!.length === 1 ? "" : "s"}
                                        </span>
                                    )}
                                    {lvl.certificate && (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            <Award className="h-3 w-3" /> {lvl.certificate}
                                        </span>
                                    )}
                                </div>
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
                        {editingIndex !== null ? "Edit level" : "Add a level"}
                    </p>
                    {editingIndex !== null && (
                        <button type="button" onClick={handleCancelEdit} className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
                            <X className="h-3.5 w-3.5" /> Cancel edit
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        value={draft.name}
                        onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                        placeholder="Level name, e.g. Beginner"
                        className="h-11 border-2 focus:border-amber-500"
                    />
                    <Input
                        value={draft.subtitle}
                        onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))}
                        placeholder="Subtitle, e.g. Foundation & Technical Core"
                        className="h-11 border-2 focus:border-amber-500"
                    />
                </div>

                <Textarea
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="What this level covers"
                    className="border-2 focus:border-amber-500"
                />

                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Assessment / requirement points</p>
                    <TagListEditor
                        items={draft.points || []}
                        onChange={(points) => setDraft((d) => ({ ...d, points }))}
                        placeholder="Type a point and press Enter, e.g. Minimum pass mark: 70%"
                    />
                </div>

                <Input
                    value={draft.certificate}
                    onChange={(e) => setDraft((d) => ({ ...d, certificate: e.target.value }))}
                    placeholder="Certificate awarded, e.g. Certificate in Foundations of AI for Climate Resilience"
                    className="h-11 border-2 focus:border-amber-500"
                />

                <div className="flex justify-end">
                    <Button type="button" onClick={handleAdd} className="bg-amber-600 hover:bg-amber-700">
                        {editingIndex !== null ? "Save Changes" : "Add Level"}
                    </Button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
