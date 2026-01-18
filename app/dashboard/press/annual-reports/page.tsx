"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { annualReportsService } from "@/services/annualReportsService";

export default function AnnualReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await annualReportsService.getAll();
            setReports(data);
        } catch (error) {
            console.error("Error loading annual reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this annual report?")) {
            try {
                await annualReportsService.delete(id);
                await loadReports();
            } catch (error) {
                console.error("Error deleting annual report:", error);
                alert("Failed to delete annual report");
            }
        }
    };

    const filtered = reports.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

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
                <h1 className="text-2xl font-bold">Annual Reports</h1>
                <Link href="/dashboard/press/annual-reports/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search annual reports..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No annual reports found. {reports.length === 0 && <Link href="/dashboard/press/annual-reports/new" className="text-pink-600 hover:underline">Create your first one</Link>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            <div className="w-full h-40 bg-gray-200 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                                ) : (
                                    <div className="w-full h-40 bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    {item.year && <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.year}</span>}
                                    {item.date && <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>}
                                </div>
                                <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                                {item.description && (
                                    <div className="text-sm text-gray-600 line-clamp-3 mb-2" dangerouslySetInnerHTML={{ __html: item.description.substring(0, 150) + '...' }} />
                                )}
                                {item.category && (
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{item.category}</span>
                                )}
                                <div className="flex gap-2 mt-4">
                                    <Link href={`/dashboard/press/annual-reports/${item._id}`} className="flex-1 text-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">View</Link>
                                    <Link href={`/dashboard/press/annual-reports/${item._id}/edit`} className="flex-1 text-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Edit</Link>
                                    <button onClick={() => handleDelete(item._id)} className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
