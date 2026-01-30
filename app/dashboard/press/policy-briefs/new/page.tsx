"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { policyBriefsService } from "@/services/policyBriefsService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

export default function AddPolicyBrief() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        datePosted: "",
        coverImage: "",
        availableResources: [] as string[],
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingImage(true);
            const { url } = await policyBriefsService.uploadImage(file);
            setForm(prev => ({ ...prev, coverImage: url }));
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
            const { url } = await policyBriefsService.uploadResource(file);
            setForm(prev => ({
                ...prev,
                availableResources: [...prev.availableResources, url]
            }));
        } catch (err) {
            alert(err instanceof Error ? err.message : "File upload failed");
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
        if (!form.title || !form.description) {
            alert("Title and description are required");
            return;
        }
        try {
            setSaving(true);
            await policyBriefsService.create({
                title: form.title,
                description: form.description,
                datePosted: form.datePosted || new Date().toISOString(),
                coverImage: form.coverImage || undefined,
                availableResources: form.availableResources,
            });
            router.push("/dashboard/press/policy-briefs");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to create policy brief");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Add Policy Brief</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Title *</label>
                    <input
                        value={form.title}
                        onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter policy brief title"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Date *</label>
                    <input
                        type="date"
                        value={form.datePosted ? form.datePosted.split("T")[0] : ""}
                        onChange={e => setForm(prev => ({ ...prev, datePosted: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Description * (Rich Text Editor)</label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <ImprovedTiptapEditor
                            value={form.description}
                            onChange={html => setForm(prev => ({ ...prev, description: html }))}
                            uploadUrl="https://api.demo.arin-africa.org/policy-briefs/upload"
                            uploadFieldName="file"
                            placeholder="Write your policy brief description here. You can add images, format text, and more..."
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">You can upload images directly in the editor</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                    {uploadingImage && <p className="text-sm text-pink-600 mt-2">Uploading image...</p>}
                    {form.coverImage && (
                        <div className="mt-3">
                            <img src={form.coverImage} alt="Preview" className="h-48 w-auto object-cover rounded-lg shadow-md" />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Resources (PDF, DOCX, PPTX, etc.)</label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        onChange={handleResourceUpload}
                        disabled={uploadingResource}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploadingResource && <p className="text-sm text-blue-600 mt-2">Uploading file...</p>}
                    {form.availableResources.length > 0 && (
                        <ul className="mt-3 space-y-2">
                            {form.availableResources.map((url, i) => (
                                <li key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm">
                                    <span className="text-blue-600 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                        </svg>
                                        {url.split("/").pop()}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeResource(i)}
                                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex gap-4 pt-6 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {saving ? "Creating..." : "Create Policy Brief"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
