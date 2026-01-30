"use client";
import { useEffect, useState } from "react";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";
import { useRouter, useParams } from "next/navigation";
import { getTeamMember, updateTeamMember, uploadImage } from "@/services/teamsService";

export default function EditTeamMemberPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [form, setForm] = useState({ firstName: "", lastName: "", role: "", bio: "", image: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getTeamMember(id);
                setForm({ firstName: data.firstName, lastName: data.lastName, role: data.role, bio: data.bio || "", image: data.image || "" });
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
        try {
            const res = await uploadImage(file);
            setForm(prev => ({ ...prev, image: res.url }));
        } catch (e: any) {
            setError(e.message || "Image upload failed");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateTeamMember(id, form);
            router.push("/dashboard/programs/teams");
        } catch (e: any) {
            setError(e.message || "Save failed");
        } finally { setSaving(false); }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-semibold mb-4">Edit Team Member</h1>
            {error && <div className="text-red-600 mb-4">{error}</div>}
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
                    <label className="block text-sm">Bio</label>
                    <ImprovedTiptapEditor
                        value={form.bio}
                        onChange={handleBioChange}
                        placeholder="Edit team member bio..."
                    />
                </div>
                <div>
                    <label className="block text-sm">Image</label>
                    <input type="file" accept="image/*" onChange={handleImage} />
                    {form.image && <img src={`https://api.demo.arin-africa.org${form.image}`} alt="Uploaded" className="mt-2 h-20 rounded" />}
                </div>
                <div className="flex gap-2">
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
                    <button type="button" onClick={() => router.push('/dashboard/programs/teams')} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                </div>
            </form>
        </div>
    );
}
