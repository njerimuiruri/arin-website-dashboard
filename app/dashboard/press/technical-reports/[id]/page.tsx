"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyReport = { id: "1", title: "Technical Report 2025", summary: "A summary of the 2025 technical report." };

export default function ViewTechnicalReport() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyReport.title}</h1>
                <p className="mb-4">{dummyReport.summary}</p>
                <Link href={`/dashboard/press/technical-reports/${dummyReport.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
