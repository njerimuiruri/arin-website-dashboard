"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { newsBriefsService } from "@/services/newsBriefsService";

export default function NewsBriefsPage() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        newsBriefsService.getAll()
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
        if (confirm("Are you sure you want to delete this news brief?")) {
            try {
                await newsBriefsService.delete(id);
                setItems(items.filter(item => item._id !== id));
            } catch (err: any) {
                alert("Error deleting news brief: " + err.message);
            }
        }
    };

    const filtered = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    // Helper to strip HTML tags
    function stripHtml(html: string) {
        if (!html) return '';
        return html.replace(/<[^>]+>/g, '');
    }

    // Helper to truncate to n words
    function truncateWords(text: string, n: number) {
        if (!text) return '';
        const words = text.split(/\s+/);
        return words.slice(0, n).join(' ') + (words.length > n ? '...' : '');
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">News Briefs</h1>
                <Link href="/dashboard/press/news-briefs/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search news briefs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No news briefs found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            {(item.image || item.coverImage) && (
                                <img src={item.image || item.coverImage} alt={item.title} className="w-full h-40 object-cover" />
                            )}
                            <div className="p-4">
                                <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                                {/* Authors */}
                                <div className="text-xs text-gray-700 mb-1">
                                    <span className="font-semibold">Authors:</span> {item.authors && item.authors.length > 0 ? item.authors.join(", ") : 'N/A'}
                                </div>
                                {/* Truncated, plain description */}
                                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                    {truncateWords(stripHtml(item.description), 10)}
                                </p>
                                <div className="text-xs text-gray-500 mb-4">
                                    {item.datePosted ? new Date(item.datePosted).toLocaleDateString() : ''}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/press/news-briefs/${item._id}`} className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                        View
                                    </Link>
                                    <Link href={`/dashboard/press/news-briefs/${item._id}/edit`} className="flex-1 text-center px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
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
