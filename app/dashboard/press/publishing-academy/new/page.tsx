"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function AddPublishingAcademy() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const router = useRouter();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Add logic to save
        router.push("/dashboard/press/publishing-academy");
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add Publishing Academy</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
                <Button type="submit">Save</Button>
            </form>
        </div>
    );
}
