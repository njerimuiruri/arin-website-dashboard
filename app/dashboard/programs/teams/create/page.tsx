"use client";
import { useState } from "react";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";
import { createTeamMember, uploadImage } from "@/services/teamsService";
import { useRouter } from "next/navigation";

export default function CreateTeamMemberPage() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: "", lastName: "", role: "", category: "", bio: "", image: "" });
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (uploading) return;
        setError(null);
        try {
            setSubmitting(true);
            await createTeamMember(form);
            router.push("/dashboard/programs/teams");
        } catch (e: any) {
            setError(e.message || "Create failed");
        } finally {
            setSubmitting(false);
        }
    };

    const imgPreviewSrc = form.image
        ? form.image.startsWith("http")
            ? form.image
            : `https://api.demo.arin-africa.org${form.image}`
        : null;

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-semibold mb-4">Create Team Member</h1>
            {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        <option value="Focal Points">Focal Points and their Assistants</option>
                        <option value="Secretariat">Secretariat Staff</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm">Bio</label>
                    <ImprovedTiptapEditor
                        value={form.bio}
                        onChange={handleBioChange}
                        placeholder="Enter team member bio..."
                    />
                </div>

                {/* Image upload */}
                <div>
                    <label className="block text-sm font-medium mb-1">Photo</label>
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

                    {imgPreviewSrc && !uploading && (
                        <div className="mt-2">
                            <p className="text-xs text-green-600 mb-1">Image ready to save</p>
                            <img
                                src={imgPreviewSrc}
                                alt="Preview"
                                className="h-32 w-32 object-cover rounded-lg border"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Creating..." : uploading ? "Wait for upload…" : "Create"}
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
