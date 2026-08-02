"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Pencil, Trash2, Upload, X } from "lucide-react";
import { uploadOrgLogo } from "@/services/researchProjectService";

export interface OrgItem {
    name: string;
    logo?: string;
}

interface OrgLogosManagerProps {
    items: OrgItem[];
    onChange: (items: OrgItem[]) => void;
    namePlaceholder?: string;
}

const emptyDraft: OrgItem = { name: "", logo: "" };

export default function OrgLogosManager({ items, onChange, namePlaceholder = "Organisation name" }: OrgLogosManagerProps) {
    const [draft, setDraft] = useState<OrgItem>(emptyDraft);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        try {
            setUploading(true);
            const res = await uploadOrgLogo(file);
            setDraft((d) => ({ ...d, logo: res.url }));
        } catch (err: any) {
            setError(err.message || "Failed to upload logo");
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = () => {
        if (!draft.name.trim()) {
            setError("Give it a name before adding it.");
            return;
        }
        if (editingIndex !== null) {
            onChange(items.map((item, i) => (i === editingIndex ? draft : item)));
            setEditingIndex(null);
        } else {
            onChange([...items, draft]);
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
        <div className="space-y-4">
            {items.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-lg border-2 ${
                                editingIndex === idx ? "bg-blue-50 border-blue-300" : "bg-slate-50 border-slate-100"
                            }`}
                        >
                            <div className="w-8 h-8 rounded-md overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                {item.logo ? (
                                    <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                                ) : (
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                )}
                            </div>
                            <p className="text-sm font-semibold text-slate-800 max-w-40 truncate">{item.name}</p>
                            <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-blue-700 hover:bg-blue-50 h-7 w-7" onClick={() => handleEdit(idx)}>
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7" onClick={() => handleRemove(idx)}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-5 bg-blue-50/60 rounded-lg border-2 border-dashed border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                        {editingIndex !== null ? "Edit" : "Add"}
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
                    placeholder={namePlaceholder}
                    className="h-11 border-2 focus:border-blue-500"
                />

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="h-11 border-2 focus:border-blue-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 max-w-sm"
                    />
                    {uploading && <span className="text-sm text-slate-500 flex items-center gap-1"><Upload className="h-4 w-4 animate-pulse" /> Uploading...</span>}
                    {draft.logo && !uploading && <span className="text-sm text-emerald-600 font-medium">Logo ready ✓</span>}
                    <Button type="button" onClick={handleAdd} disabled={uploading} className="bg-blue-600 hover:bg-blue-700 ml-auto">
                        {editingIndex !== null ? "Save Changes" : "Add"}
                    </Button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
