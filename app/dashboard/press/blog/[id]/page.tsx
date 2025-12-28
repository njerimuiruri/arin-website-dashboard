"use client";
import React from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

const dummyBlog = { id: "1", title: "First Blog Post", summary: "A summary of the first blog post." };

export default function ViewBlog() {
    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{dummyBlog.title}</h1>
                <p className="mb-4">{dummyBlog.summary}</p>
                <Link href={`/dashboard/press/blog/${dummyBlog.id}/edit`}><Button>Edit</Button></Link>
            </Card>
        </div>
    );
}
