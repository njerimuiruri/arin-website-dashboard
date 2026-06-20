"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { booksService } from "@/services/booksService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

interface Book {
    _id?: string;
    title: string;
    authors?: string;
    description: string;
    image?: string;
    datePosted?: string;
    availableResources?: string[];
    year?: number;
    embargoDate?: string;
    price?: number;
    currency?: string;
}

export default function EditBookPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<Book>({
        title: "",
        authors: "",
        description: "",
    });

    useEffect(() => {
        loadBook();
    }, [id]);

    const loadBook = async () => {
        try {
            setLoading(true);
            const data = await booksService.getById(id);
            setForm({
                ...data,
                authors: Array.isArray(data.authors) ? data.authors.join(", ") : (data.authors || ""),
                availableResources: data.availableResources || [],
            });
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load book");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const { url } = await booksService.uploadImage(file);
            setForm(prev => ({ ...prev, image: url }));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingResource(true);
            const { url } = await booksService.uploadResource(file);
            setForm(prev => ({
                ...prev,
                availableResources: [...(prev.availableResources || []), url]
            }));
        } catch (err) {
            alert(err instanceof Error ? err.message : "PDF upload failed");
        } finally {
            setUploadingResource(false);
        }
    };

    const removeResource = (index: number) => {
        setForm(prev => ({
            ...prev,
            availableResources: (prev.availableResources || []).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.description) {
            alert("Title and description are required");
            return;
        }

        try {
            setSaving(true);
            const authorsArray = (form.authors || "").split(",").map(a => a.trim()).filter(a => a);
            await booksService.update(id, {
                ...form,
                authors: authorsArray,
                availableResources: form.availableResources || []
            });
            router.push(`/dashboard/press/books/${id}`);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update book");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Book title"
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Authors</label>
                    <input
                        name="authors"
                        value={form.authors || ""}
                        onChange={handleChange}
                        placeholder="Author 1, Author 2, Author 3"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Date Posted</label>
                    <input
                        name="datePosted"
                        type="date"
                        value={form.datePosted ? form.datePosted.split("T")[0] : ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Embargo Date</label>
                    <input
                        name="embargoDate"
                        type="date"
                        value={form.embargoDate ? form.embargoDate.split("T")[0] : ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">If set, this book will be marked as embargoed until this date.</p>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Price</label>
                        <input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price ?? ""}
                            onChange={e => setForm({ ...form, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                            placeholder="e.g. 30"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="w-28">
                        <label className="block text-sm font-medium mb-2">Currency</label>
                        <select
                            name="currency"
                            value={form.currency || "USD"}
                            onChange={e => setForm({ ...form, currency: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="USD">USD</option>
                            <option value="KES">KES</option>
                            <option value="NGN">NGN</option>
                            <option value="GHS">GHS</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <ImprovedTiptapEditor
                        value={form.description}
                        onChange={(html) => setForm(prev => ({ ...prev, description: html }))}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full border rounded px-3 py-2"
                    />
                    {uploadingImage && <p className="text-sm text-gray-500 mt-1">Uploading image...</p>}
                    {form.image && (
                        <img src={form.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">PDF Resources</label>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResourceUpload}
                        disabled={uploadingResource}
                        className="w-full border rounded px-3 py-2"
                    />
                    {uploadingResource && <p className="text-sm text-gray-500 mt-1">Uploading PDF...</p>}
                    {(form.availableResources || []).length > 0 && (
                        <ul className="mt-2 space-y-1">
                            {(form.availableResources || []).map((url, i) => (
                                <li key={i} className="text-sm text-blue-600 flex justify-between">
                                    <span>✓ {url.split("/").pop()}</span>
                                    <button type="button" onClick={() => removeResource(i)} className="text-red-600 hover:underline text-xs">Remove</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
