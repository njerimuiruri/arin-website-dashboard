
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { newsBriefsService } from "@/services/newsBriefsService";

export default function NewsBriefViewPage() {
    const params = useParams();
    const id = params.id as string;
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBrief() {
            try {
                setLoading(true);
                const data = await newsBriefsService.getById(id);
                setItem(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || "Failed to load news brief");
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchBrief();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!item) return <div className="p-8">News Brief not found.</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {(item.coverImage || item.image) && (
                <img src={item.coverImage || item.image} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />
            )}
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.category}</span>
                <span className="text-xs text-gray-500">{item.datePosted ? new Date(item.datePosted).toLocaleDateString() : ""}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <div className="mb-2">
                <span className="font-semibold">Author:</span> {item.author}
            </div>
            {item.description && (
                <div className="prose mb-4" dangerouslySetInnerHTML={{ __html: item.description }} />
            )}
            {item.availableResources && item.availableResources.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-semibold mb-2">Resources</h2>
                    <ul className="list-disc pl-5">
                        {item.availableResources.map((url: string, i: number) => (
                            <li key={i}>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {url.split("/").pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex justify-between items-center mt-6">
                <span className="text-xs text-gray-400">ID: {item._id}</span>
                <Link href={`/dashboard/press/news-briefs/${item._id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}
