"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { policyBriefsService } from "@/services/policyBriefsService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";
import { FileText, ImageIcon, X, Upload } from "lucide-react";

export default function EditPolicyBrief() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        datePosted: "",
        image: "",
        availableResources: [] as string[],
    });

    useEffect(() => {
        async function loadBrief() {
            try {
                setLoading(true);
                const data = await policyBriefsService.getById(id);
                setForm({
                    title: data.title || "",
                    description: data.description || "",
                    datePosted: data.datePosted ? data.datePosted.split("T")[0] : "",
                    image: data.image || "",
                    availableResources: (data.availableResources || []).filter(Boolean),
                });
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load policy brief");
            } finally {
                setLoading(false);
            }
        }
        loadBrief();
    }, [id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingImage(true);
            const { url } = await policyBriefsService.uploadImage(file);
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
            const { url } = await policyBriefsService.uploadResource(file);
            if (url) setForm(prev => ({ ...prev, availableResources: [...prev.availableResources, url] }));
        } catch (err) {
            alert(err instanceof Error ? err.message : "File upload failed");
        } finally {
            setUploadingResource(false);
        }
    };

    const removeResource = (index: number) => {
        setForm(prev => ({ ...prev, availableResources: prev.availableResources.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.description) { alert("Title and description are required"); return; }
        try {
            setSaving(true);
            await policyBriefsService.update(id, {
                title: form.title,
                description: form.description,
                datePosted: form.datePosted || new Date().toISOString(),
                image: form.image || undefined,
                availableResources: form.availableResources.filter(Boolean),
            });
            router.push(`/dashboard/press/policy-briefs/${id}`);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to update policy brief");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Edit Policy Brief</h1>
                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-sm">{form.title || "Untitled"}</p>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="edit-brief-form" disabled={saving}
                        className="px-5 py-2 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            <form id="edit-brief-form" onSubmit={handleSubmit}>
                <div className="flex gap-0">

                    {/* ── Left: Editor ── */}
                    <div className="flex-1 min-w-0 p-6 space-y-5">

                        {/* Title */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Title *</label>
                            <input
                                value={form.title}
                                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter policy brief title..."
                                className="w-full text-lg font-semibold text-gray-900 placeholder-gray-300 border-0 focus:outline-none focus:ring-0"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Publication Date *</label>
                            <input
                                type="date"
                                value={form.datePosted ? form.datePosted.split("T")[0] : ""}
                                onChange={e => setForm(prev => ({ ...prev, datePosted: e.target.value }))}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Rich Text Editor */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Content *</span>
                                <span className="text-xs text-gray-400">— Use the toolbar to format text, insert images, tables, and more</span>
                            </div>
                            <ImprovedTiptapEditor
                                value={form.description}
                                onChange={html => setForm(prev => ({ ...prev, description: html }))}
                                uploadUrl="https://api.demo.arin-africa.org/policy-briefs/upload"
                                uploadFieldName="file"
                                placeholder="Write your policy brief content here..."
                            />
                        </div>
                    </div>

                    {/* ── Right: Sidebar ── */}
                    <div className="w-80 shrink-0 border-l border-gray-200 bg-white p-5 space-y-6 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">

                        {/* Cover Image */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" /> Cover Image
                            </h3>
                            {form.image ? (
                                <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-3">
                                    <img src={form.image} alt="Cover" className="w-full h-44 object-cover" />
                                    <button type="button" onClick={() => setForm(prev => ({ ...prev, image: "" }))}
                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-colors mb-3">
                                    {uploadingImage ? (
                                        <span className="text-xs text-pink-600 font-medium">Uploading...</span>
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">Click to upload cover image</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                                </label>
                            )}
                            {form.image && (
                                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 hover:text-pink-600 transition-colors">
                                    <Upload className="w-3.5 h-3.5" /> Replace image
                                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                                </label>
                            )}
                        </div>

                        <div className="border-t border-gray-100" />

                        {/* Resources */}
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Attached Resources
                            </h3>

                            <label className="flex items-center gap-2 w-full px-3 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors mb-3">
                                {uploadingResource ? (
                                    <span className="text-xs text-blue-600 font-medium">Uploading...</span>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="text-xs text-gray-500">Upload PDF / DOCX / PPTX</span>
                                    </>
                                )}
                                <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={handleResourceUpload} disabled={uploadingResource} className="hidden" />
                            </label>

                            {form.availableResources.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-3">No resources attached yet</p>
                            ) : (
                                <ul className="space-y-2">
                                    {form.availableResources.map((url, i) => (
                                        <li key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg">
                                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span className="text-xs text-blue-800 font-medium truncate flex-1" title={(url ?? "").split("/").pop()}>
                                                {(url ?? "").split("/").pop() || "File"}
                                            </span>
                                            <button type="button" onClick={() => removeResource(i)}
                                                className="text-red-400 hover:text-red-600 shrink-0">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
