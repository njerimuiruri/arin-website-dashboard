"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";

const dummyVideo = { id: "1", title: "ARIN Webinar 2025", summary: "Webinar recording from 2025." };

export default function EditVideo() {
    const [title, setTitle] = useState(dummyVideo.title);
    const [summary, setSummary] = useState(dummyVideo.summary);
    const router = useRouter();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Add logic to update
        router.push(`/dashboard/press/video-gallery/${dummyVideo.id}`);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Video</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
                <Button type="submit">Update</Button>
            </form>
        </div>
    );
}
