"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyAcademy = { id: "1", title: "Publishing Workshop 2025", summary: "Learn about academic publishing." };

export default function ViewPublishingAcademy() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyAcademy.title}</h1>
                <p className="mb-4">{dummyAcademy.summary}</p>
                <Link href={`/dashboard/press/publishing-academy/${dummyAcademy.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
