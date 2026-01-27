"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { newslettersService } from "@/services/newslettersService";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from "next/link";

export default function ViewNewsletter() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [newsletter, setNewsletter] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        newslettersService.getById(id)
            .then((data) => {
                setNewsletter(data);
                setError(null);
            })
            .catch((err) => setError(err.message || 'Failed to load newsletter'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!newsletter) return <div className="p-8">Newsletter not found.</div>;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card className="p-6 border-2 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold mb-2">{newsletter.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {newsletter.image && (
                            <div className="mb-4">
                                <img src={newsletter.image} alt="Cover" className="w-full max-w-md h-auto rounded-lg shadow-md" />
                            </div>
                        )}
                        {newsletter.authors && newsletter.authors.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {newsletter.authors.map((author: string, idx: number) => (
                                    <Badge key={idx} className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-2">{author}</Badge>
                                ))}
                            </div>
                        )}
                        <div className="mb-4 text-gray-500 text-sm flex gap-4">
                            {newsletter.year && <span>Year: {newsletter.year}</span>}
                            {newsletter.datePosted && <span>Date: {new Date(newsletter.datePosted).toLocaleDateString()}</span>}
                        </div>
                        <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: newsletter.description }} />
                        <div className="flex gap-2">
                            <Link href={`/dashboard/press/newsletters/${id}/edit`}><Button>Edit</Button></Link>
                            <Button variant="outline" onClick={() => router.push('/dashboard/press/newsletters')}>Back to List</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
