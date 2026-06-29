"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { booksService } from "@/services/booksService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

export default function NewBookPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        authors: "",
        datePosted: new Date().toISOString().split("T")[0],
        description: "",
        image: "",
        resources: [] as string[],
        embargoDate: "",
        price: "",
        currency: "USD",
        resourcesPublic: true,
    });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);

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
                resources: [...prev.resources, url]
            }));
        } catch (err) {
            alert(err instanceof Error ? err.message : "PDF upload failed");
        } finally {
            setUploadingResource(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.description) {
            alert("Title and description are required");
            return;
        }

        try {
            setLoading(true);
            await booksService.create({
                title: form.title,
                authors: form.authors.split(",").map(a => a.trim()).filter(a => a),
                datePosted: form.datePosted,
                description: form.description,
                image: form.image || undefined,
                availableResources: form.resources,
                embargoDate: form.embargoDate || undefined,
                price: form.price ? parseFloat(form.price) : undefined,
                currency: form.currency || "USD",
                resourcesPublic: form.resourcesPublic,
            });
            router.push("/dashboard/press/books");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to create book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
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
                    <label className="block text-sm font-medium mb-2">Authors (comma-separated)</label>
                    <input 
                        name="authors" 
                        value={form.authors} 
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
                        value={form.datePosted}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Embargo Date</label>
                    <input
                        name="embargoDate"
                        type="date"
                        value={form.embargoDate}
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
                            value={form.price}
                            onChange={handleChange}
                            placeholder="e.g. 30"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="w-28">
                        <label className="block text-sm font-medium mb-2">Currency</label>
                        <select
                            name="currency"
                            value={form.currency}
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
                    {form.resources.length > 0 && (
                        <ul className="mt-2">
                            {form.resources.map((url, i) => (
                                <li key={i} className="text-sm text-blue-600">✓ {url.split("/").pop()}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex items-center gap-3 p-4 border rounded bg-gray-50">
                    <input
                        type="checkbox"
                        id="resourcesPublic"
                        checked={form.resourcesPublic}
                        onChange={e => setForm({ ...form, resourcesPublic: e.target.checked })}
                        className="w-4 h-4 accent-pink-600"
                    />
                    <div>
                        <label htmlFor="resourcesPublic" className="text-sm font-medium cursor-pointer">
                            Show resources publicly on the book page
                        </label>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Uncheck this to hide the "Available Resources" download section from visitors. Useful for paid books.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading || uploadingResource || uploadingImage}
                        className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Book"}
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
