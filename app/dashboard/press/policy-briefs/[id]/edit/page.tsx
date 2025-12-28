"use client";
import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";

const dummyBrief = { id: "1", title: "Policy Brief 2025", summary: "Key policy recommendations for 2025." };

export default function EditPolicyBrief() {
    const [title, setTitle] = useState(dummyBrief.title);
    const [summary, setSummary] = useState(dummyBrief.summary);
    const router = useRouter();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Add logic to update
        router.push(`/dashboard/press/policy-briefs/${dummyBrief.id}`);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Policy Brief</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Input placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} required />
                <Button type="submit">Update</Button>
            </form>
        </div>
    );
}
