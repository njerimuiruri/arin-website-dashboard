"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Link2, Trash2 } from "lucide-react";

export interface RelatedInitiative {
    title: string;
    description?: string;
    url: string;
    image?: string;
}

interface RelatedInitiativesManagerProps {
    items: RelatedInitiative[];
    onChange: (items: RelatedInitiative[]) => void;
}

const emptyDraft: RelatedInitiative = { title: "", description: "", url: "" };

export default function RelatedInitiativesManager({ items, onChange }: RelatedInitiativesManagerProps) {
    const [draft, setDraft] = useState<RelatedInitiative>(emptyDraft);
    const [error, setError] = useState<string | null>(null);

    const handleAdd = () => {
        if (!draft.title.trim() || !draft.url.trim()) {
            setError("Give the initiative a title and a link before adding it.");
            return;
        }
        onChange([...items, draft]);
        setDraft(emptyDraft);
        setError(null);
    };

    const handleRemove = (idx: number) => {
        onChange(items.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-6">
            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border-2 border-slate-100">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                                <Link2 className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                                {item.description && <p className="text-sm text-slate-500 mt-0.5">{item.description}</p>}
                                <p className="text-xs text-blue-600 mt-1 truncate">{item.url}</p>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => handleRemove(idx)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-5 bg-amber-50/60 rounded-lg border-2 border-dashed border-amber-200 space-y-4">
                <p className="text-sm font-semibold text-slate-700">Add a related initiative</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        placeholder="e.g. ARIN Publishing Academy"
                        className="h-11 border-2 focus:border-amber-500"
                    />
                    <Input
                        value={draft.url}
                        onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                        placeholder="Link, e.g. https://... or /press/publishing-academy"
                        className="h-11 border-2 focus:border-amber-500"
                    />
                </div>
                <Textarea
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Short description shown on the card (optional)"
                    className="border-2 focus:border-amber-500"
                />
                <div className="flex justify-end">
                    <Button type="button" onClick={handleAdd} className="bg-amber-600 hover:bg-amber-700">
                        Add Initiative
                    </Button>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
