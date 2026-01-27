"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { newsBriefsService } from "@/services/newsBriefsService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

export default function NewNewsBriefPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [form, setForm] = useState({
        title: "",
        authors: [""],
        datePosted: "",
        description: "",
        coverImage: "",
        availableResources: [] as string[],
    });
    const [error, setError] = useState<string | null>(null);


    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAuthorChange = (idx: number, value: string) => {
        setForm(prev => ({
            ...prev,
            authors: prev.authors.map((a, i) => i === idx ? value : a)
        }));
    };

    const addAuthor = () => {
        setForm(prev => ({ ...prev, authors: [...prev.authors, ""] }));
    };

    const removeAuthor = (idx: number) => {
        setForm(prev => ({ ...prev, authors: prev.authors.filter((_, i) => i !== idx) }));
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingCover(true);
            const { url } = await newsBriefsService.uploadImage(file);
            setForm(prev => ({ ...prev, coverImage: url }));
        } catch (err) {
            setError("Cover image upload failed");
        } finally {
            setUploadingCover(false);
        }
    };

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingResource(true);
            const { url } = await newsBriefsService.uploadResource(file);
            setForm(prev => ({
                ...prev,
                availableResources: [...prev.availableResources, url]
            }));
        } catch (err) {
            setError("Resource upload failed");
        } finally {
            setUploadingResource(false);
        }
    };

    const removeResource = (index: number) => {
        setForm(prev => ({
            ...prev,
            availableResources: prev.availableResources.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await newsBriefsService.create(form);
            router.push("/dashboard/press/news-briefs");
        } catch (err: any) {
            setError(err.message || "Failed to create news brief");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New News Brief</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleInput} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <div>
                    <label className="block mb-1 font-semibold">Authors</label>
                    {form.authors.map((author, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={author}
                                onChange={e => handleAuthorChange(idx, e.target.value)}
                                placeholder={`Author ${idx + 1}`}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                            {form.authors.length > 1 && (
                                <button type="button" onClick={() => removeAuthor(idx)} className="px-2 text-red-500">Remove</button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addAuthor} className="px-3 py-1 bg-gray-200 rounded text-xs">Add Author</button>
                </div>
                <input name="datePosted" value={form.datePosted} onChange={handleInput} type="date" className="w-full border rounded px-3 py-2" required />
                <div>
                    <label className="block mb-1 font-semibold">Description</label>
                    <ImprovedTiptapEditor
                        value={form.description}
                        onChange={val => setForm(prev => ({ ...prev, description: val }))}
                        placeholder="Enter news brief description..."
                        uploadUrl={process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/news-briefs/upload` : "http://localhost:5001/news-briefs/upload"}
                        uploadFieldName="file"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Cover Image</label>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} />
                    {uploadingCover && <span className="text-xs text-gray-500 ml-2">Uploading...</span>}
                    {form.coverImage && <img src={form.coverImage} alt="cover" className="w-full h-40 object-cover mt-2 rounded" />}
                </div>
                <div>
                    <label className="block mb-1 font-semibold">Available Resources (PDF)</label>
                    <input type="file" accept="application/pdf" onChange={handleResourceUpload} />
                    {uploadingResource && <span className="text-xs text-gray-500 ml-2">Uploading...</span>}
                    <ul className="mt-2 space-y-1">
                        {form.availableResources.map((url, i) => (
                            url && typeof url === 'string' ? (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{url.split("/").pop()}</a>
                                    <button type="button" onClick={() => removeResource(i)} className="text-red-500 hover:underline">Remove</button>
                                </li>
                            ) : null
                        ))}
                    </ul>
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700" disabled={saving}>{saving ? "Saving..." : "Create"}</button>
            </form>
        </div>
    );
}
