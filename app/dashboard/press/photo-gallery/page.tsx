"use client";
import React from "react";
import { Card, Button } from "@/components/ui";
import Link from "next/link";

const dummyPhotos = [
    { id: "1", title: "ARIN Event 2025", summary: "Photos from the 2025 event." },
];

export default function PhotoGalleryList() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Photo Gallery</h1>
                <Link href="/dashboard/press/photo-gallery/new">
                    <Button>Add New</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyPhotos.map((item) => (
                    <Card key={item.id} className="p-4">
                        <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                        <p className="mb-4">{item.summary}</p>
                        <Link href={`/dashboard/press/photo-gallery/${item.id}`}><Button>View</Button></Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}
