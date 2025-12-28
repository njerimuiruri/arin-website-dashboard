"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyPaper = { id: "1", title: "Working Paper 2025", summary: "A summary of the 2025 working paper." };

export default function ViewWorkingPaper() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyPaper.title}</h1>
                <p className="mb-4">{dummyPaper.summary}</p>
                <Link href={`/dashboard/press/working-papers/${dummyPaper.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
