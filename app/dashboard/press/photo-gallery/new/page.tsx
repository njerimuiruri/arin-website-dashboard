"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";
import { createPhotoVideo } from "@/services/photosVideosService";

export default function AddPhoto() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) return alert('Please select an image file.');
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', 'photo');
        formData.append('file', file);
        await createPhotoVideo(formData);
        setLoading(false);
        router.push("/dashboard/press/photo-gallery");
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add Photo</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </form>
        </div>
    );
}
