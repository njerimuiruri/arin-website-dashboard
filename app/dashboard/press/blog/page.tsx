"use client";
import React from "react";
import { Card, Button } from "@/components/ui";
import Link from "next/link";

const dummyBlogs = [
    { id: "1", title: "First Blog Post", summary: "A summary of the first blog post." },
];

export default function BlogList() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Blog</h1>
                <Link href="/dashboard/press/blog/new">
                    <Button>Add New</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyBlogs.map((item) => (
                    <Card key={item.id} className="p-4">
                        <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                        <p className="mb-4">{item.summary}</p>
                        <Link href={`/dashboard/press/blog/${item.id}`}><Button>View</Button></Link>
                    </Card>
                ))}
            </div>
        </div>
    );
}
