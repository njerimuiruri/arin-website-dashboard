"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { annualReportsService } from "@/services/annualReportsService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

interface AnnualReport {
    _id?: string;
    title: string;
    description: string;
    image?: string;
    date?: string;
    year?: string;
    category?: string;
    availableResources?: string[];
}

export default function EditAnnualReportPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<AnnualReport>({
        title: "",
        description: "",
        availableResources: []
    });

    useEffect(() => {
        loadReport();
    }, [id]);

    const loadReport = async () => {
        try {
            setLoading(true);
            const data = await annualReportsService.getById(id);
            setForm({
                ...data,
                date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
                availableResources: data.availableResources || []
            });
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load annual report");
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
            const { url } = await annualReportsService.uploadImage(file);
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
            const { url } = await annualReportsService.uploadResource(file);
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
            await annualReportsService.update(id, {
                title: form.title,
                date: form.date,
                year: form.year,
                category: form.category,
                description: form.description,
                image: form.image || undefined,
                availableResources: form.availableResources || []
            });
            router.push(`/dashboard/press/annual-reports/${id}`);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update annual report");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Annual Report</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Annual Report Title"
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <input
                        name="date"
                        type="date"
                        value={form.date || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <input
                        name="year"
                        value={form.year || ""}
                        onChange={handleChange}
                        placeholder="2024"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                        name="category"
                        value={form.category || ""}
                        onChange={handleChange}
                        placeholder="Annual Reports"
                        className="w-full border rounded px-3 py-2"
                    />
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
                    {form.availableResources && form.availableResources.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {form.availableResources.map((url, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                                    <span className="text-sm text-blue-600">📄 {url.split("/").pop()}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeResource(i)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50"
                    >
                        {saving ? "Updating..." : "Update Annual Report"}
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
