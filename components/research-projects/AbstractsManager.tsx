"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, User, Trash2, Upload, X } from "lucide-react";
import { uploadAbstractImage } from "@/services/researchProjectService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

export interface AbstractItem {
    name: string;
    title?: string;
    photo?: string;
    body: string;
    group?: string;
}

interface AbstractsManagerProps {
    items: AbstractItem[];
    onChange: (items: AbstractItem[]) => void;
    themes?: string[];
}

const emptyDraft: AbstractItem = { name: "", title: "", photo: "", body: "", group: "" };

export default function AbstractsManager({ items, onChange, themes = [] }: AbstractsManagerProps) {
    const [draft, setDraft] = useState<AbstractItem>(emptyDraft);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        try {
            setUploading(true);
            const res = await uploadAbstractImage(file);
            setDraft((d) => ({ ...d, photo: res.url }));
        } catch (err: any) {
            setError(err.message || "Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = () => {
        if (!draft.name.trim() || !stripHtml(draft.body).trim()) {
            setError("Add a name and the abstract text before adding it.");
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
        <div className="space-y-6">
            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                                editingIndex === idx ? "bg-indigo-50 border-indigo-300" : "bg-slate-50 border-slate-100"
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                {item.photo ? (
                                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                                {item.title && <p className="text-sm text-slate-500 truncate">{item.title}</p>}
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{stripHtml(item.body)}</p>
                                {item.group && (
                                    <span className="inline-block mt-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                        {item.group}
                                    </span>
                                )}
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 shrink-0" onClick={() => handleEdit(idx)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0" onClick={() => handleRemove(idx)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-5 bg-indigo-50/60 rounded-lg border-2 border-dashed border-indigo-200 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                        {editingIndex !== null ? "Edit abstract" : "Add an abstract"}
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
                        placeholder="Submitter's name"
                        className="h-11 border-2 focus:border-indigo-500"
                    />
                    <Input
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        placeholder="Role/affiliation (optional), e.g. PhD Candidate, University of Nairobi"
                        className="h-11 border-2 focus:border-indigo-500"
                    />
                </div>

                <div className="border-2 rounded-md overflow-hidden focus-within:border-indigo-500">
                    <ImprovedTiptapEditor
                        value={draft.body}
                        onChange={(html) => setDraft((d) => ({ ...d, body: html }))}
                        placeholder="Paste or type the full abstract text"
                        uploadUrl="https://api.demo.arin-africa.org/api/research-projects/upload-description-image"
                        uploadFieldName="image"
                    />
                </div>

                <div>
                    <select
                        value={draft.group || ""}
                        onChange={(e) => setDraft((d) => ({ ...d, group: e.target.value }))}
                        className="h-11 w-full border-2 focus:border-indigo-500 rounded-md px-3"
                    >
                        <option value="">No theme — general abstracts</option>
                        {themes.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1.5">
                        {themes.length > 0
                            ? "Pick a theme to move this abstract onto that theme's own tab on the project page."
                            : "No themes yet — add one in the Themes card above to group abstracts under it."}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="h-11 border-2 focus:border-indigo-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 max-w-sm"
                    />
                    {uploading && <span className="text-sm text-slate-500 flex items-center gap-1"><Upload className="h-4 w-4 animate-pulse" /> Uploading...</span>}
                    {draft.photo && !uploading && <span className="text-sm text-emerald-600 font-medium">Photo ready ✓</span>}
                    <Button type="button" onClick={handleAdd} disabled={uploading} className="bg-indigo-600 hover:bg-indigo-700 ml-auto">
                        {editingIndex !== null ? "Save Changes" : "Add Abstract"}
                    </Button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
