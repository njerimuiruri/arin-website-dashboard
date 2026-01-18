"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCops, deleteCop } from "@/services/copService";

export default function CopPage() {
    const [copItems, setCopItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [yearFilter, setYearFilter] = useState<string>("");

    useEffect(() => {
        loadCops();
    }, []);

    const loadCops = async () => {
        setLoading(true);
        const data = await getCops();
        setCopItems(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this COP item?")) {
            try {
                await deleteCop(id);
                await loadCops();
            } catch (error) {
                console.error("Error deleting COP:", error);
                alert("Failed to delete COP item");
            }
        }
    };

    const filtered = copItems.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        const matchesYear = !yearFilter || item.year?.toString() === yearFilter;
        return matchesSearch && matchesYear;
    });

    const years = Array.from(new Set(copItems.map((item) => item.year).filter(Boolean))).sort().reverse();

    if (loading) {
        return (
            <div className="p-8">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">COP Policy Briefs</h1>
                <Link href="/dashboard/convening-platforms/cop/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">
                    Add New
                </Link>
            </div>

            <div className="mb-6 flex gap-4">
                <input
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Search COP items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="border rounded px-3 py-2"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                >
                    <option value="">All Years</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No COP items found. {copItems.length === 0 && <Link href="/dashboard/convening-platforms/cop/new" className="text-pink-600 hover:underline">Create your first one</Link>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((item) => (
                        <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            {item.image && (
                                <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                            )}
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    {item.year && (
                                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.year}</span>
                                    )}
                                    {item.date && (
                                        <span className="text-xs text-gray-500">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                                {item.description && (
                                    <div 
                                        className="text-sm text-gray-600 line-clamp-3 mb-2"
                                        dangerouslySetInnerHTML={{ __html: item.description.substring(0, 150) + '...' }}
                                    />
                                )}
                                <div className="flex gap-2 mt-4">
                                    <Link
                                        href={`/dashboard/convening-platforms/cop/${item._id}`}
                                        className="flex-1 text-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/dashboard/convening-platforms/cop/${item._id}/edit`}
                                        className="flex-1 text-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
