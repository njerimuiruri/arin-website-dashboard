"use client";
import React, { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getImpactStory } from "@/services/impactStoriesService";

export default function ViewImpactStory() {
    const { id } = useParams() as { id: string };
    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getImpactStory(id)
            .then(data => setStory(data))
            .catch(err => setError(err.message || 'Failed to load story'))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="p-6 max-w-xl mx-auto">
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-600">{error}</div>
            ) : !story ? (
                <div>Not found</div>
            ) : (
                <Card className="p-6">
                    {story.image && (
                        <img src={story.image.startsWith('http') ? story.image : `http://localhost:5001${story.image}`}
                            alt="Impact story image" className="mb-4 w-full max-h-64 object-cover rounded" />
                    )}
                    <h1 className="text-2xl font-bold mb-2">{story.title}</h1>
                    <div className="mb-2 text-gray-500 text-sm">{story.date && (new Date(story.date)).toLocaleDateString()}</div>
                    <div className="mb-4 prose" dangerouslySetInnerHTML={{ __html: story.description || '' }} />
                    {story.video && (
                        <video src={story.video.startsWith('http') ? story.video : `http://localhost:5001${story.video}`}
                            controls className="mb-4 w-full max-h-64 rounded" />
                    )}
                    <Link href={`/dashboard/press/impact-stories/${story._id || story.id}/edit`}><Button>Edit</Button></Link>
                </Card>
            )}
        </div>
    );
}
