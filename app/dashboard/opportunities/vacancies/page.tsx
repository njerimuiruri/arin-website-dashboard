"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVacancies, deleteVacancy } from "@/services/vacanciesService";

export default function VacanciesPage() {
    const [vacancies, setVacancies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadVacancies();
    }, []);

    const loadVacancies = async () => {
        setLoading(true);
        const data = await getVacancies();
        setVacancies(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this vacancy?")) {
            try {
                await deleteVacancy(id);
                await loadVacancies();
            } catch (error) {
                console.error("Error deleting vacancy:", error);
                alert("Failed to delete vacancy");
            }
        }
    };

    const filtered = vacancies.filter(item => item.positionName.toLowerCase().includes(search.toLowerCase()));

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
                <h1 className="text-2xl font-bold">Vacancies</h1>
                <Link href="/dashboard/opportunities/vacancies/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New Vacancy</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search vacancies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            
            {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No vacancies found. {vacancies.length === 0 && <Link href="/dashboard/opportunities/vacancies/new" className="text-pink-600 hover:underline">Create your first one</Link>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            {item.image && <img src={item.image} alt={item.positionName} className="w-full h-40 object-cover" />}
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.employmentType}</span>
                                    {item.deadline && <span className="text-xs text-red-500">Deadline: {new Date(item.deadline).toLocaleDateString()}</span>}
                                </div>
                                <h2 className="font-semibold text-lg mb-1">{item.positionName}</h2>
                                {item.description && (
                                    <div className="text-sm text-gray-600 line-clamp-3 mb-2" dangerouslySetInnerHTML={{ __html: item.description.substring(0, 150) + '...' }} />
                                )}
                                {item.datePosted && <p className="text-xs text-gray-500 mb-2">Posted: {new Date(item.datePosted).toLocaleDateString()}</p>}
                                <div className="flex gap-2 mt-4">
                                    <Link href={`/dashboard/opportunities/vacancies/${item._id}`} className="flex-1 text-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">View</Link>
                                    <Link href={`/dashboard/opportunities/vacancies/${item._id}/edit`} className="flex-1 text-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Edit</Link>
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
