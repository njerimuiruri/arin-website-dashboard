"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Edit, Trash2, FileText } from 'lucide-react';
import { getCop, deleteCop } from '@/services/copService';

const CopDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [cop, setCop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCop() {
            if (!id) return;
            try {
                const data = await getCop(id);
                if (!data) {
                    setError('COP item not found');
                } else {
                    setCop(data);
                }
            } catch (err) {
                console.error('Failed to fetch COP item:', err);
                setError('Failed to load COP item');
            } finally {
                setLoading(false);
            }
        }
        fetchCop();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this COP item?')) return;

        try {
            await deleteCop(id);
            alert('COP item deleted successfully!');
            router.push('/dashboard/convening-platforms/cop');
        } catch (error) {
            console.error('Failed to delete COP item:', error);
            alert('Failed to delete COP item. Please try again.');
        }
    };

    const handleDownloadResource = (resourceUrl: string) => {
        window.open(resourceUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">Loading COP item...</div>
            </div>
        );
    }

    if (error || !cop) {
        return (
            <div className="p-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="bg-red-100 text-red-700 p-4 rounded">{error || 'COP item not found'}</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={20} /> Back
            </button>

            {cop.image && (
                <img src={cop.image} alt={cop.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{cop.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{new Date(cop.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {cop.year && (
                        <div>
                            <p className="text-sm text-gray-500">Year</p>
                            <p className="font-medium">{cop.year}</p>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: cop.description }} />
                </div>

                {cop.availableResources && cop.availableResources.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <FileText size={20} /> Available Resources
                        </h2>
                        <div className="space-y-2">
                            {cop.availableResources.map((resource: string, index: number) => (
                                <div key={index} className="bg-gray-100 p-3 rounded flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1">
                                        <FileText size={16} className="text-blue-600" />
                                        <span className="break-all">{resource}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDownloadResource(resource)}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex-shrink-0"
                                    >
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                    <button
                        onClick={() => router.push(`/dashboard/convening-platforms/cop/${id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Edit size={18} /> Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        <Trash2 size={18} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CopDetailPage;
