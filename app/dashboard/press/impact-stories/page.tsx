"use client";
import React, { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import Link from "next/link";
import { getImpactStories, deleteImpactStory } from "@/services/impactStoriesService";

export default function ImpactStoriesList() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getImpactStories()
            .then(data => setStories(data))
            .catch(err => setError(err.message || 'Failed to load stories'))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this story?')) return;
        setDeletingId(id);
        try {
            await deleteImpactStory(id);
            setStories(stories => stories.filter(s => s._id !== id && s.id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Impact Stories</h1>
                <Link href="/dashboard/press/impact-stories/new">
                    <Button>Add New</Button>
                </Link>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stories.length === 0 && <div>No impact stories found.</div>}
                    {stories.map((item) => (
                        <Card key={item._id || item.id} className="p-4 flex flex-col justify-between">
                            <div>
                                <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                                <p className="mb-4 line-clamp-3">{item.description?.replace(/<[^>]*>/g, '').slice(0, 120) || ''}</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <Link href={`/dashboard/press/impact-stories/${item._id || item.id}`}><Button>View</Button></Link>
                                <Link href={`/dashboard/press/impact-stories/${item._id || item.id}/edit`}><Button variant="secondary">Edit</Button></Link>
                                <Button variant="destructive" onClick={() => handleDelete(item._id || item.id)} disabled={deletingId === (item._id || item.id)}>
                                    {deletingId === (item._id || item.id) ? 'Deleting...' : 'Delete'}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
