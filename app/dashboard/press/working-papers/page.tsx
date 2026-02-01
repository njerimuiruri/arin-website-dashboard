"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { workingPaperSeriesService, WorkingPaperSeries } from "@/services/workingPaperSeriesService";

export default function WorkingPapersPage() {
    const [items, setItems] = useState<WorkingPaperSeries[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        workingPaperSeriesService.getAll()
            .then(data => {
                setItems(data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this working paper?")) {
            try {
                await workingPaperSeriesService.delete(id);
                setItems(items.filter(item => item._id !== id));
            } catch (err: any) {
                alert("Error deleting working paper: " + err.message);
            }
        }
    };

    const filtered = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Working Papers</h1>
                <Link href="/dashboard/press/working-papers/new" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Add New
                </Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search working papers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No working papers found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => {
                        if (!item._id) return null;

                        return (
                            <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                                {item.image && (
                                    <img
                                        src={item.image.startsWith('http') ? item.image : `https://api.demo.arin-africa.org${item.image}`}
                                        alt={item.title}
                                        className="w-full h-40 object-cover"
                                    />
                                )}
                                <div className="p-4">
                                    <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                                    <div className="text-sm text-gray-600 line-clamp-3 mb-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: item.description || "<em>No description provided.</em>" }} />
                                    {item.authors && item.authors.length > 0 && (
                                        <p className="text-xs text-gray-500 mb-3">
                                            Authors: {item.authors.join(", ")}
                                        </p>
                                    )}
                                    <div className="text-xs text-gray-500 mb-4">
                                        {item.datePosted ? new Date(item.datePosted).toLocaleDateString() : "N/A"}
                                    </div>
                                    {item.availableResources && item.availableResources.length > 0 && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-xs text-gray-700">Resources:</span>
                                            <ul className="list-disc ml-4">
                                                {item.availableResources.map((url: string, idx: number) => (
                                                    <li key={idx}>
                                                        <a href={url.startsWith('http') ? url : `https://api.demo.arin-africa.org${url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Resource {idx + 1}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Link href={`/dashboard/press/working-papers/${item._id}`} className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                            View
                                        </Link>
                                        <Link href={`/dashboard/press/working-papers/${item._id}/edit`} className="flex-1 text-center px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item._id!)}
                                            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}