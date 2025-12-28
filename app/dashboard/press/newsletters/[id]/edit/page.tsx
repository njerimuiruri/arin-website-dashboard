"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";

const dummyNewsletter = { id: "1", title: "Newsletter Jan 2025", summary: "Highlights from January 2025." };

export default function EditNewsletter() {
    const [title, setTitle] = useState(dummyNewsletter.title);
    const [summary, setSummary] = useState(dummyNewsletter.summary);
    const router = useRouter();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Add logic to update
        router.push(`/dashboard/press/newsletters/${dummyNewsletter.id}`);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Newsletter</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
                <Button type="submit">Update</Button>
            </form>
        </div>
    );
}
