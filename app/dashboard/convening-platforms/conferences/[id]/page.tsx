"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Edit, Trash2, FileText } from 'lucide-react';
import { getConference, deleteConference } from '@/services/conferencesService';

const ConferenceDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [conference, setConference] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchConference() {
            if (!id) return;
            try {
                const data = await getConference(id);
                if (!data) {
                    setError('Conference not found');
                } else {
                    setConference(data);
                }
            } catch (err) {
                console.error('Failed to fetch conference:', err);
                setError('Failed to load conference');
            } finally {
                setLoading(false);
            }
        }
        fetchConference();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this conference?')) return;

        try {
            await deleteConference(id);
            alert('Conference deleted successfully!');
            router.push('/dashboard/convening-platforms/conferences');
        } catch (error) {
            console.error('Failed to delete conference:', error);
            alert('Failed to delete conference. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">Loading conference...</div>
            </div>
        );
    }

    if (error || !conference) {
        return (
            <div className="p-8">
                <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="bg-red-100 text-red-700 p-4 rounded">{error || 'Conference not found'}</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={20} /> Back
            </button>

            {conference.image && (
                <img src={conference.image} alt={conference.title} className="w-full h-64 object-cover rounded-lg mb-6" />
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{conference.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={20} />
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{new Date(conference.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {conference.venue && (
                        <div className="flex items-center gap-3 text-gray-600">
                            <MapPin size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Venue</p>
                                <p className="font-medium">{conference.venue}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Description</h2>
                    <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: conference.description }} />
                </div>

                {conference.availableResources && conference.availableResources.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <FileText size={20} /> Available Resources
                        </h2>
                        <div className="space-y-2">
                            {conference.availableResources.map((resource: string, index: number) => (
                                <div key={index} className="bg-gray-100 p-3 rounded flex items-center gap-2">
                                    <FileText size={16} className="text-blue-600" />
                                    <span>{resource}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                    <button
                        onClick={() => router.push(`/dashboard/convening-platforms/conferences/${id}/edit`)}
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

export default ConferenceDetailPage;
