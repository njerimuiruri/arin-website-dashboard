"use client";
import { useEffect, useState } from "react";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";
import { useRouter, useParams } from "next/navigation";
import { getTeamMember, updateTeamMember, uploadImage } from "@/services/teamsService";

export default function EditTeamMemberPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [form, setForm] = useState({ firstName: "", lastName: "", role: "", category: "", bio: "", image: "" });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getTeamMember(id);
                setForm({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                    category: data.category || "",
                    bio: data.bio || "",
                    image: data.image || "",
                });
            } catch (e: any) {
                setError(e.message || "Failed to load");
            } finally { setLoading(false); }
        };
        if (id) load();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleBioChange = (html: string) => {
        setForm(prev => ({ ...prev, bio: html }));
    };

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError(null);
        try {
            setUploading(true);
            const res = await uploadImage(file);
            if (!res.url) throw new Error("Upload succeeded but no URL returned");
            setForm(prev => ({ ...prev, image: res.url }));
        } catch (e: any) {
            setUploadError(e.message || "Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (uploading) return;
        setError(null);
        try {
            setSaving(true);
            await updateTeamMember(id, form);
            router.push("/dashboard/programs/teams");
        } catch (e: any) {
            setError(e.message || "Save failed");
        } finally { setSaving(false); }
    };

    const imgPreviewSrc = form.image
        ? form.image.startsWith("http")
            ? form.image
            : `https://api.demo.arin-africa.org${form.image}`
        : null;

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-semibold mb-4">Edit Team Member</h1>
            {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm">First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} className="mt-1 w-full border rounded p-2" required />
                </div>
                <div>
                    <label className="block text-sm">Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} className="mt-1 w-full border rounded p-2" required />
                </div>
                <div>
                    <label className="block text-sm">Role</label>
                    <input name="role" value={form.role} onChange={handleChange} className="mt-1 w-full border rounded p-2" required />
                </div>
                <div>
                    <label className="block text-sm">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1 w-full border rounded p-2"
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Executive Director">Executive Director</option>
                        <option value="Focal Points">Regional Focal Points</option>
                        <option value="Secretariat">Secretariat Staff</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm">Bio</label>
                    <ImprovedTiptapEditor
                        value={form.bio}
                        onChange={handleBioChange}
                        placeholder="Edit team member bio..."
                    />
                </div>

                {/* Image upload */}
                <div>
                    <label className="block text-sm font-medium mb-1">Photo</label>

                    {/* Current image preview */}
                    {imgPreviewSrc && !uploading && (
                        <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Current photo:</p>
                            <img
                                src={imgPreviewSrc}
                                alt="Current"
                                className="h-32 w-32 object-cover rounded-lg border"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                        </div>
                    )}

                    {/* Upload input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        disabled={uploading}
                        className="block"
                    />

                    {uploading && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Uploading image… please wait before saving
                        </div>
                    )}

                    {uploadError && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{uploadError}</div>
                    )}

                    {!uploading && form.image && (
                        <p className="mt-1 text-xs text-green-600">Image ready to save</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : uploading ? "Wait for upload…" : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard/programs/teams")}
                        className="px-4 py-2 bg-gray-100 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
