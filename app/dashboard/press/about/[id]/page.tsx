"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyAbout = { id: "1", title: "About ARIN", summary: "Who we are and what we do." };

export default function ViewAbout() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyAbout.title}</h1>
                <p className="mb-4">{dummyAbout.summary}</p>
                <Link href={`/dashboard/press/about/${dummyAbout.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
