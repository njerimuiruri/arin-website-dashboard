"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyVideo = { id: "1", title: "ARIN Webinar 2025", summary: "Webinar recording from 2025." };

export default function ViewVideo() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyVideo.title}</h1>
                <p className="mb-4">{dummyVideo.summary}</p>
                <Link href={`/dashboard/press/video-gallery/${dummyVideo.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
