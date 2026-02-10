"use client";
import React from "react";
import { Card, Button } from "@/components/ui";
import Link from "next/link";


import { useEffect, useState } from 'react';
import { blogsService, Blog } from '@/services/blogsService';



export default function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = () => {
        setLoading(true);
        blogsService.getAll()
            .then(data => {
                setBlogs(data);
                setError(null);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this blog?")) {
            try {
                await blogsService.delete(id);
                setBlogs(blogs.filter(item => item._id !== id));
            } catch (err: any) {
                alert("Error deleting blog: " + err.message);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Blog</h1>
                <div className="flex gap-2">
                    <Button onClick={fetchBlogs} variant="secondary">Refresh</Button>
                    <Link href="/dashboard/press/blog/new">
                        <Button>Add New</Button>
                    </Link>
                </div>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">Error: {error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogs.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">No blogs found</div>
                    ) : blogs.map((item) => (
                        <Card key={item._id} className="p-4">
                            <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                            <p className="mb-4">{item.description?.replace(/<[^>]+>/g, '').slice(0, 100)}...</p>
                            <div className="flex gap-2">
                                <Link href={`/dashboard/press/blog/${item._id}`}><Button>View</Button></Link>
                                <Button variant="destructive" onClick={() => handleDelete(item._id!)}>Delete</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
