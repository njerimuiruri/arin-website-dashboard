"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Briefcase, Edit, Trash2 } from 'lucide-react';
import { getVacancy, deleteVacancy } from '@/services/vacanciesService';

const VacancyDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [vacancy, setVacancy] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVacancy() {
            if (!id) return;
            try {
                const data = await getVacancy(id);
                if (!data) {
                    setError('Vacancy not found');
                } else {
                    setVacancy(data);
                }
            } catch (err) {
                console.error('Failed to fetch vacancy:', err);
                setError('Failed to load vacancy');
            } finally {
                setLoading(false);
            }
        }
        fetchVacancy();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this vacancy?')) return;

        try {
            await deleteVacancy(id);
            alert('Vacancy deleted successfully!');
            router.push('/dashboard/opportunities/vacancies');
        } catch (error) {
            console.error('Failed to delete vacancy:', error);
            alert('Failed to delete vacancy. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">Loading vacancy...</div>
            </div>
        );
    }

    if (error || !vacancy) {
        return (
            <div className="p-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="bg-red-100 text-red-700 p-4 rounded">{error || 'Vacancy not found'}</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={20} /> Back
            </button>

            {vacancy.image && (
                <img src={vacancy.image} alt={vacancy.positionName} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{vacancy.positionName}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Briefcase size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Employment Type</p>
                            <p className="font-medium">{vacancy.employmentType}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Date Posted</p>
                            <p className="font-medium">{new Date(vacancy.datePosted).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Application Deadline</p>
                            <p className="font-medium">{new Date(vacancy.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: vacancy.description }} />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                    <button
                        onClick={() => router.push(`/dashboard/opportunities/vacancies/${id}/edit`)}
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

export default VacancyDetailPage;
