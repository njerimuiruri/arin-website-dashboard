
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";


import { callForBooksService } from "@/services/callForBooksService";
import dynamic from "next/dynamic";
const WysiwygEditor = dynamic(() => import("@/components/WysiwygEditor"), { ssr: false });


export default function CallEditPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let isMounted = true;
        callForBooksService.getById(id)
            .then(data => { if (isMounted) setForm(data); })
            .catch(err => { if (isMounted) setError(err.message); })
            .finally(() => { if (isMounted) setLoading(false); });
        return () => { isMounted = false; };
    }, [id]);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDescriptionChange = (value) => {
        setForm((prev) => ({ ...prev, description: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await callForBooksService.update(id, form);
            router.push(`/dashboard/press/call-for-chapters/${id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!form) return <div className="p-8">Call for Book Chapter not found.</div>;

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Call for Book Chapter</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title || ""} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="datePosted" value={form.datePosted || ""} onChange={handleChange} placeholder="Date Posted" className="w-full border rounded px-3 py-2" />
                <input name="deadline" value={form.deadline || ""} onChange={handleChange} placeholder="Deadline" className="w-full border rounded px-3 py-2" required />
                <input name="image" value={form.image || ""} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <WysiwygEditor value={form.description || ""} onChange={handleDescriptionChange} />
                </div>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700" disabled={saving}>{saving ? "Saving..." : "Update"}</button>
            </form>
        </div>
    );
}
