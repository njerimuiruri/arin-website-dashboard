"use client";
import { useState } from "react";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";
import { createTeamMember, uploadImage } from "@/services/teamsService";
import { useRouter } from "next/navigation";

export default function CreateTeamMemberPage() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: "", lastName: "", role: "", bio: "", image: "" });
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleBioChange = (html: string) => {
        setForm(prev => ({ ...prev, bio: html }));
    };

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const res = await uploadImage(file);
            setForm(prev => ({ ...prev, image: res.url }));
        } catch (e: any) {
            setError(e.message || "Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-semibold mb-4">Create Team Member</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
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
                    <label className="block text-sm">Bio</label>
                    <ImprovedTiptapEditor
                        value={form.bio}
                        onChange={handleBioChange}
                        placeholder="Enter team member bio..."
                    />
                </div>
                <div>
                    <label className="block text-sm">Image</label>
                    <input type="file" accept="image/*" onChange={handleImage} />
                    {uploading && <div className="text-sm text-gray-600">Uploading...</div>}
                    {form.image && <img src={`http://localhost:5001${form.image}`} alt="Uploaded" className="mt-2 h-20 rounded" />}
                </div>
                <div className="flex gap-2">
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">{submitting ? 'Creating...' : 'Create'}</button>
                    <button type="button" onClick={() => router.push('/dashboard/programs/teams')} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                </div>
            </form>
        </div>
    );
}
