"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";

const dummyPaper = { id: "1", title: "Working Paper 2025", summary: "A summary of the 2025 working paper." };

export default function EditWorkingPaper() {
    const [title, setTitle] = useState(dummyPaper.title);
    const [summary, setSummary] = useState(dummyPaper.summary);
    const router = useRouter();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Add logic to update
        router.push(`/dashboard/press/working-papers/${dummyPaper.id}`);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Working Paper</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
                <Button type="submit">Update</Button>
            </form>
        </div>
    );
}
