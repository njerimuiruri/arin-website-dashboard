"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";

const dummyAbout = { id: "1", title: "About ARIN", summary: "Who we are and what we do." };

export default function EditAbout() {
    const [title, setTitle] = useState(dummyAbout.title);
    const [summary, setSummary] = useState(dummyAbout.summary);
    const router = useRouter();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Add logic to update
        router.push(`/dashboard/press/about/${dummyAbout.id}`);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit About</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
                <Button type="submit">Update</Button>
            </form>
        </div>
    );
}
