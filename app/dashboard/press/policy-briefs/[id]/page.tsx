"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyBrief = { id: "1", title: "Policy Brief 2025", summary: "Key policy recommendations for 2025." };

export default function ViewPolicyBrief() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyBrief.title}</h1>
                <p className="mb-4">{dummyBrief.summary}</p>
                <Link href={`/dashboard/press/policy-briefs/${dummyBrief.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
