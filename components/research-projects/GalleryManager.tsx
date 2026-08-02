"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { uploadGalleryImage } from "@/services/researchProjectService";

export interface GalleryItem {
    url: string;
    caption?: string;
}

interface GalleryManagerProps {
    items: GalleryItem[];
    onChange: (items: GalleryItem[]) => void;
}

export default function GalleryManager({ items, onChange }: GalleryManagerProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setError(null);
        setUploading(true);
        try {
            const uploaded: GalleryItem[] = [];
            for (const file of Array.from(files)) {
                const res = await uploadGalleryImage(file);
                uploaded.push({ url: res.url, caption: "" });
            }
            onChange([...items, ...uploaded]);
        } catch (err: any) {
            setError(err.message || "Failed to upload image(s)");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleCaptionChange = (idx: number, caption: string) => {
        onChange(items.map((item, i) => (i === idx ? { ...item, caption } : item)));
    };

    const handleRemove = (idx: number) => {
        onChange(items.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-4">
            {items.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border-2 border-slate-100 bg-slate-50">
                            <img src={item.url} alt={item.caption || "Gallery image"} className="w-full h-32 object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <Input
                                value={item.caption || ""}
                                onChange={(e) => handleCaptionChange(idx, e.target.value)}
                                placeholder="Caption (optional)"
                                className="h-9 text-xs border-0 border-t-2 rounded-none focus:border-purple-500"
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="h-11 border-2 focus:border-purple-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 max-w-sm"
                />
                {uploading && <span className="text-sm text-slate-500 flex items-center gap-1"><Upload className="h-4 w-4 animate-pulse" /> Uploading...</span>}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
