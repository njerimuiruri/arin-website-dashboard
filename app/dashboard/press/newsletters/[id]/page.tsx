"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyNewsletter = { id: "1", title: "Newsletter Jan 2025", summary: "Highlights from January 2025." };

export default function ViewNewsletter() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyNewsletter.title}</h1>
                <p className="mb-4">{dummyNewsletter.summary}</p>
                <Link href={`/dashboard/press/newsletters/${dummyNewsletter.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
