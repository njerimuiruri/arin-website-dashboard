"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyStory = { id: "1", title: "Impact Story 1", summary: "A summary of the first impact story." };

export default function ViewImpactStory() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyStory.title}</h1>
                <p className="mb-4">{dummyStory.summary}</p>
                <Link href={`/dashboard/press/impact-stories/${dummyStory.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
