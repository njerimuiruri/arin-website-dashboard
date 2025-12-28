"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyPhoto = { id: "1", title: "ARIN Event 2025", summary: "Photos from the 2025 event." };

export default function ViewPhoto() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyPhoto.title}</h1>
                <p className="mb-4">{dummyPhoto.summary}</p>
                <Link href={`/dashboard/press/photo-gallery/${dummyPhoto.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
