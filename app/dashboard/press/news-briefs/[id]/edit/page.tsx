
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { newsBriefsService } from "@/services/newsBriefsService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

export default function EditNewsBriefPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [form, setForm] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBrief() {
            try {
                setLoading(true);
                const data = await newsBriefsService.getById(id);
                setForm({
                    title: data.title || "",
                    author: data.author || "",
                    datePosted: data.datePosted ? data.datePosted.slice(0, 10) : "",
                    description: data.description || "",
                    coverImage: data.coverImage || "",
                    availableResources: data.availableResources || [],
                });
                setError(null);
            } catch (err: any) {
                setError(err.message || "Failed to load news brief");
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchBrief();
    }, [id]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingCover(true);
            const { url } = await newsBriefsService.uploadImage(file);
            setForm((prev: any) => ({ ...prev, coverImage: url }));
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
            setForm((prev: any) => ({
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
        setForm((prev: any) => ({
            ...prev,
            availableResources: prev.availableResources.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await newsBriefsService.update(id, form);
            router.push(`/dashboard/press/news-briefs/${id}`);
        } catch (err: any) {
            setError(err.message || "Failed to update news brief");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !form) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit News Brief</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleInput} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="author" value={form.author} onChange={handleInput} placeholder="Author" className="w-full border rounded px-3 py-2" required />
                <input name="datePosted" value={form.datePosted} onChange={handleInput} type="date" className="w-full border rounded px-3 py-2" required />
                <div>
                    <label className="block mb-1 font-semibold">Description</label>
                    <ImprovedTiptapEditor
                        value={form.description}
                        onChange={val => setForm((prev: any) => ({ ...prev, description: val }))}
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
                        {form.availableResources.map((url: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{url.split("/").pop()}</a>
                                <button type="button" onClick={() => removeResource(i)} className="text-red-500 hover:underline">Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700" disabled={saving}>{saving ? "Saving..." : "Update"}</button>
            </form>
        </div>
    );
}
