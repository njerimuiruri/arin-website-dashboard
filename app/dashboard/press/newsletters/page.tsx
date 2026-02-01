"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { newslettersService, Newsletter } from "@/services/newslettersService";

export default function NewslettersList() {
    const [items, setItems] = useState<Newsletter[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        newslettersService.getAll()
            .then(data => {
                setItems(data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);


    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (confirm("Are you sure you want to delete this newsletter?")) {
            try {
                await newslettersService.delete(id);
                setItems(items.filter(item => item._id !== id));
            } catch (err: any) {
                alert("Error deleting newsletter: " + err.message);
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
                <h1 className="text-2xl font-bold">Newsletters</h1>
                <Link href="/dashboard/press/newsletters/new" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                    Add New
                </Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search newsletters..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No newsletters found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            {item.image && <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />}
                            <div className="p-4">
                                <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.description.replace(/<[^>]*>/g, '')}</p>
                                <div className="text-xs text-gray-500 mb-4">
                                    {item.datePosted ? new Date(item.datePosted).toLocaleDateString() : "N/A"}
                                </div>
                                <div className="flex gap-2">
                                    {item._id && (
                                        <>
                                            <Link href={`/dashboard/press/newsletters/${item._id}`} className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                                View
                                            </Link>
                                            <Link href={`/dashboard/press/newsletters/${item._id}/edit`} className="flex-1 text-center px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
