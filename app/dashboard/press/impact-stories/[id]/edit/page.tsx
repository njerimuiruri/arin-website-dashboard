"use client";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter, useParams } from "next/navigation";
import { getImpactStory, updateImpactStory } from "@/services/impactStoriesService";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

export default function EditImpactStory() {
    const { id } = useParams() as { id: string };
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        setFetching(true);
        getImpactStory(id)
            .then(data => {
                setTitle(data.title || "");
                setDescription(data.description || "");
                setDate(data.date ? data.date.slice(0, 10) : "");
            })
            .catch(err => setError(err.message || 'Failed to load story'))
            .finally(() => setFetching(false));
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data: any = { title, description, date };
            if (image) data.image = image;
            if (video) data.video = video;
            await updateImpactStory(id, data);
            router.push(`/dashboard/press/impact-stories/${id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to update impact story');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Impact Story</h1>
            {fetching ? (
                <div>Loading...</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    <ImprovedTiptapEditor value={description} onChange={setDescription} placeholder="Description (WYSIWYG)" />
                    <div>
                        <label className="block mb-1">Image</label>
                        <Input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                        <label className="block mb-1">Video</label>
                        <Input type="file" accept="video/*" onChange={e => setVideo(e.target.files?.[0] || null)} />
                    </div>
                    {error && <div className="text-red-600">{error}</div>}
                    <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
                </form>
            )}
        </div>
    );
}
