"use client";
import React, { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { blogsService, Blog } from '@/services/blogsService';

export default function ViewBlog() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params?.id) return;
        blogsService.getById(params.id as string)
            .then(data => {
                setBlog(data);
                setError(null);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [params?.id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!blog) return <div className="p-8">Blog not found.</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-2">{blog.title}</h1>
                <div className="mb-2 text-gray-600">Date: {blog.date ? new Date(blog.date).toLocaleDateString() : ''}</div>
                {blog.image && <img src={blog.image} alt="Blog" className="mb-4 max-h-48 rounded" />}
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: blog.description || '' }} />
                {blog.authors && blog.authors.length > 0 && (
                    <div className="mb-2">Authors: {blog.authors.join(', ')}</div>
                )}
                {blog.availableResources && blog.availableResources.length > 0 && (
                    <div className="mb-2">
                        Resources:
                        <ul className="list-disc ml-6">
                            {blog.availableResources.map((url, idx) => (
                                <li key={idx}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Resource {idx + 1}</a></li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="mt-4 flex gap-2">
                    <Link href={`/dashboard/press/blog/${blog._id}/edit`}><Button>Edit</Button></Link>
                    <Button variant="secondary" onClick={() => router.push('/dashboard/press/blog')}>Back</Button>
                </div>
            </Card>
        </div>
    );
}
