"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Trash2, Edit } from 'lucide-react';
import { getConferences, deleteConference, type Conference } from "@/services/conferencesService";

export default function ConferencesPage() {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedYear, setSelectedYear] = useState("All");

    useEffect(() => {
        fetchConferences();
    }, []);

    const fetchConferences = async () => {
        try {
            const data = await getConferences();
            setConferences(data);
        } catch (err) {
            console.error('Failed to fetch conferences:', err);
            setError('Failed to load conferences');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this conference?')) return;

        try {
            await deleteConference(id);
            setConferences(conferences.filter(c => c._id !== id));
        } catch (err) {
            console.error('Failed to delete conference:', err);
            alert('Failed to delete conference');
        }
    };

    const years = ['All', ...Array.from(new Set(conferences.map(c => c.year?.toString() || ''))).filter(Boolean).sort().reverse()];

    const filtered = conferences.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
        const matchesYear = selectedYear === 'All' || c.year?.toString() === selectedYear;
        return matchesSearch && matchesYear;
    });

    if (loading) {
        return <div className="p-8 text-center">Loading conferences...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Conferences</h1>
                <Link href="/dashboard/convening-platforms/conferences/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add Conference</Link>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <div className="mb-6 flex gap-4">
                <input
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Search conferences..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="border rounded px-3 py-2"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center text-gray-500">No conferences found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(conf => (
                        <div key={conf._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            {conf.image && <img src={conf.image} alt={conf.title} className="w-full h-40 object-cover" />}
                            <div className="p-4">
                                <h2 className="font-semibold text-lg mb-2 line-clamp-2">{conf.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{conf.description}</p>
                                <div className="flex justify-between items-center gap-2 mb-3">
                                    {conf.venue && <span className="text-xs text-gray-500">{conf.venue}</span>}
                                    <span className="text-xs text-gray-400">{new Date(conf.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/convening-platforms/conferences/${conf._id}`} className="flex-1 px-3 py-2 text-center bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200">View</Link>
                                    <Link href={`/dashboard/convening-platforms/conferences/${conf._id}/edit`} className="px-3 py-2 text-blue-600 hover:text-blue-800">
                                        <Edit size={18} />
                                    </Link>
                                    <button onClick={() => conf._id && handleDelete(conf._id)} className="px-3 py-2 text-red-600 hover:text-red-800">
                                        <Trash2 size={18} />
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
