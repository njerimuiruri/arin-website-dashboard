"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Pencil, Trash2, Upload, X } from "lucide-react";
import { uploadResourceFile } from "@/services/researchProjectService";

export interface ResourceItem {
    url: string;
    title: string;
    description?: string;
    type?: string;
    group?: string;
}

export const RESOURCE_TYPE_OPTIONS = [
    { value: "pdf", label: "PDF Document" },
    { value: "presentation", label: "Presentation" },
    { value: "report", label: "Report" },
    { value: "publication", label: "Publication" },
    { value: "toolkit", label: "Toolkit" },
    { value: "guideline", label: "Guideline" },
    { value: "other", label: "Other" },
];

interface ResourcesManagerProps {
    items: ResourceItem[];
    onChange: (items: ResourceItem[]) => void;
    themes?: string[];
}

const emptyDraft: ResourceItem = { url: "", title: "", description: "", type: "pdf", group: "" };

export default function ResourcesManager({ items, onChange, themes = [] }: ResourcesManagerProps) {
    const [draft, setDraft] = useState<ResourceItem>(emptyDraft);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        try {
            setUploading(true);
            const res = await uploadResourceFile(file);
            setDraft((d) => ({ ...d, url: res.url, title: d.title || file.name.replace(/\.[^/.]+$/, "") }));
        } catch (err: any) {
            setError(err.message || "Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = () => {
        if (!draft.url || !draft.title.trim()) {
            setError("Upload a file and give it a title before adding it.");
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
                    {items.map((res, idx) => (
                        <div
                            key={idx}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                                editingIndex === idx ? "bg-blue-50 border-blue-300" : "bg-slate-50 border-slate-100"
                            }`}
                        >
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-700 shrink-0">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{res.title}</p>
                                {res.description && <p className="text-sm text-slate-500 mt-0.5">{res.description}</p>}
                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                    <span className="inline-block text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                                        {res.type || "other"}
                                    </span>
                                    {res.group && (
                                        <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                            {res.group}
                                        </span>
                                    )}
                                </div>
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
                        {editingIndex !== null ? "Edit resource" : "Add a resource"}
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
                        placeholder="Resource title, e.g. Evidence Synthesis Report"
                        className="h-11 border-2 focus:border-blue-500"
                    />
                    <select
                        value={draft.type}
                        onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
                        className="h-11 border-2 focus:border-blue-500 rounded-md px-3"
                    >
                        {RESOURCE_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <Textarea
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Short description shown on the resource card (optional)"
                    className="border-2 focus:border-blue-500"
                />

                <div>
                    <select
                        value={draft.group || ""}
                        onChange={(e) => setDraft((d) => ({ ...d, group: e.target.value }))}
                        className="h-11 w-full border-2 focus:border-blue-500 rounded-md px-3"
                    >
                        <option value="">No theme — general resources</option>
                        {themes.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1.5">
                        {themes.length > 0
                            ? "Pick a theme to move this resource onto that theme's own tab on the project page."
                            : "No themes yet — add one in the Themes card above to group resources under it."}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        type="file"
                        accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="h-11 border-2 focus:border-blue-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 max-w-sm"
                    />
                    {uploading && <span className="text-sm text-slate-500 flex items-center gap-1"><Upload className="h-4 w-4 animate-pulse" /> Uploading...</span>}
                    {draft.url && !uploading && <span className="text-sm text-emerald-600 font-medium">Ready ✓</span>}
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-blue-100" />
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Or paste a link</span>
                    <div className="h-px flex-1 bg-blue-100" />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        type="url"
                        value={draft.url}
                        onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                        placeholder="https://... link to something already hosted elsewhere (Google Drive, your website, etc.)"
                        className="h-11 border-2 focus:border-blue-500 flex-1 min-w-60"
                    />
                    <Button type="button" onClick={handleAdd} disabled={uploading} className="bg-blue-600 hover:bg-blue-700 ml-auto">
                        {editingIndex !== null ? "Save Changes" : "Add Resource"}
                    </Button>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}
