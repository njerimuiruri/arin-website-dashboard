"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { policyBriefsService } from "@/services/policyBriefsService";

interface PolicyBrief {
    _id?: string;
    title: string;
    description: string;
    coverImage?: string;
    datePosted?: string;
    year?: number;
    availableResources?: string[];
}

export default function PolicyBriefsList() {
    const [items, setItems] = useState<PolicyBrief[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await policyBriefsService.getAll();
            setItems(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await policyBriefsService.delete(id);
            setItems(items.filter(i => i._id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Delete failed");
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
                <h1 className="text-2xl font-bold">Policy Briefs</h1>
                <Link href="/dashboard/press/policy-briefs/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        {item.coverImage && (
                            <img src={item.coverImage} alt={item.title} className="w-full h-40 object-cover" />
                        )}
                        <div className="p-4">
                            <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: item.description }} />
                            <div className="flex gap-2">
                                <Link href={`/dashboard/press/policy-briefs/${item._id}`} className="text-blue-600 text-sm hover:underline">View</Link>
                                <Link href={`/dashboard/press/policy-briefs/${item._id}/edit`} className="text-blue-600 text-sm hover:underline">Edit</Link>
                                <button onClick={() => handleDelete(item._id!)} className="text-red-600 text-sm hover:underline">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filtered.length === 0 && <div className="text-center text-gray-500 mt-8">No items found</div>}
        </div>
    );
}
