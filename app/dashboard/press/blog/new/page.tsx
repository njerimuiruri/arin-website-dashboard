"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";
import { blogsService } from '@/services/blogsService';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';

export default function AddBlog() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        authors: [] as string[],
        authorInput: "",
        image: "",
        availableResources: [] as string[],
        category: "",
        date: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [resourceUploading, setResourceUploading] = useState(false);
    const router = useRouter();

    // Author handlers
    const handleAddAuthor = () => {
        const val = form.authorInput.trim();
        if (val && !form.authors.includes(val)) {
            setForm({ ...form, authors: [...form.authors, val], authorInput: "" });
        }
    };
    const handleRemoveAuthor = (author: string) => {
        setForm({ ...form, authors: form.authors.filter(a => a !== author) });
    };

    // Image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const res = await blogsService.uploadImage(file);
            setForm({ ...form, image: res.url });
        } catch (err: any) {
            setError(err.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    // Resource upload
    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setResourceUploading(true);
            const res = await blogsService.uploadResource(file);
            setForm({ ...form, availableResources: [...form.availableResources, res.url] });
        } catch (err: any) {
            setError(err.message || 'Resource upload failed');
        } finally {
            setResourceUploading(false);
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await blogsService.create({
                title: form.title,
                description: form.description,
                authors: form.authors,
                image: form.image,
                availableResources: form.availableResources,
                category: form.category,
                date: form.date,
            });
            router.push("/dashboard/press/blog");
        } catch (err: any) {
            setError(err.message || 'Failed to create blog');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add Blog</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                <Input placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <ImprovedTiptapEditor value={form.description} onChange={val => setForm(f => ({ ...f, description: val }))} />
                </div>
                <div>
                    <label className="block font-medium mb-1">Authors</label>
                    <div className="flex gap-2 mb-2">
                        <Input placeholder="Add author" value={form.authorInput} onChange={e => setForm(f => ({ ...f, authorInput: e.target.value }))} />
                        <Button type="button" onClick={handleAddAuthor}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {form.authors.map(author => (
                            <span key={author} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                                {author}
                                <button type="button" onClick={() => handleRemoveAuthor(author)} className="ml-1 text-red-500">&times;</button>
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block font-medium mb-1">Image</label>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    {uploading && <span className="text-sm text-gray-500 ml-2">Uploading...</span>}
                    {form.image && <img src={form.image} alt="Blog" className="mt-2 max-h-32 rounded" />}
                </div>
                <div>
                    <label className="block font-medium mb-1">Available Resources (PDFs)</label>
                    <Input type="file" accept="application/pdf" onChange={handleResourceUpload} />
                    {resourceUploading && <span className="text-sm text-gray-500 ml-2">Uploading...</span>}
                    <ul className="mt-2 space-y-1">
                        {form.availableResources.map((url, idx) => (
                            <li key={idx}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Resource {idx + 1}</a></li>
                        ))}
                    </ul>
                </div>
                {error && <div className="text-red-600">{error}</div>}
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </form>
        </div>
    );
}
