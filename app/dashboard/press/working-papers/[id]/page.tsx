"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { workingPaperSeriesService, WorkingPaperSeries } from "@/services/workingPaperSeriesService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ViewWorkingPaper() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<WorkingPaperSeries | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        workingPaperSeriesService.getById(id as string)
            .then(setData)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!data) return <div className="p-8">Not found</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Card className="p-6">
                {data.image && (
                    <img
                        src={data.image.startsWith('http') ? data.image : `https://api.demo.arin-africa.org${data.image}`}
                        alt={data.title}
                        className="w-full h-56 object-cover rounded mb-4"
                    />
                )}
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl font-bold mb-2">{data.title}</CardTitle>
                    <CardDescription className="text-gray-500">
                        {data.datePosted && (
                            <span>{new Date(data.datePosted).toLocaleString()}</span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {data.authors && data.authors.length > 0 && (
                        <div className="mb-2 text-sm text-gray-700">
                            <span className="font-semibold">Authors:</span> {data.authors.join(", ")}
                        </div>
                    )}
                    <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: data.description || "<em>No description provided.</em>" }} />
                    {data.availableResources && data.availableResources.length > 0 && (
                        <div className="mb-4">
                            <span className="font-semibold">Resources:</span>
                            <ul className="list-disc ml-6">
                                {data.availableResources.map((url: string, idx: number) => (
                                    <li key={idx}>
                                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Resource {idx + 1}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="flex gap-2 mt-6">
                        <Link href={`/dashboard/press/working-papers/${data._id}/edit`}>
                            <Button variant="outline">Edit</Button>
                        </Link>
                        <Button variant="outline" onClick={() => router.push('/dashboard/press/working-papers')}>Back to List</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
