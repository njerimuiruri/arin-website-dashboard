"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCsrs, deleteCsr } from "@/services/csrService";

export default function CSRPage() {
    const [csrActivities, setCsrActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadCsrs();
    }, []);

    const loadCsrs = async () => {
        setLoading(true);
        const data = await getCsrs();
        setCsrActivities(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this CSR activity?")) {
            try {
                await deleteCsr(id);
                await loadCsrs();
            } catch (error) {
                console.error("Error deleting CSR:", error);
                alert("Failed to delete CSR activity");
            }
        }
    };

    const filtered = csrActivities.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));

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
                <h1 className="text-2xl font-bold">CSR Activities</h1>
                <Link href="/dashboard/opportunities/csr/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New CSR</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search CSR activities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            
            {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No CSR activities found. {csrActivities.length === 0 && <Link href="/dashboard/opportunities/csr/new" className="text-pink-600 hover:underline">Create your first one</Link>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            {item.image && <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />}
                            <div className="p-4">
                                <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                                {item.description && (
                                    <div className="text-sm text-gray-600 line-clamp-3 mb-2" dangerouslySetInnerHTML={{ __html: item.description.substring(0, 150) + '...' }} />
                                )}
                                <div className="flex gap-2 mt-4">
                                    <Link href={`/dashboard/opportunities/csr/${item._id}`} className="flex-1 text-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">View</Link>
                                    <Link href={`/dashboard/opportunities/csr/${item._id}/edit`} className="flex-1 text-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Edit</Link>
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
