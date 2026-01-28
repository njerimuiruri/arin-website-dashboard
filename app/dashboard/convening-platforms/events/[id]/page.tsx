"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin, Edit, Trash2, Download, FileText, Tag } from 'lucide-react';
import SimpleCalendar from '@/components/SimpleCalendar';
import { getEvent, deleteEvent } from '@/services/eventsService';

const EventDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        async function fetchEvent() {
            if (!id) return;
            try {
                const data = await getEvent(id);
                if (!data) {
                    setError('Event not found');
                } else {
                    setEvent(data);
                }
            } catch (err) {
                console.error('Failed to fetch event:', err);
                setError('Failed to load event');
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            await deleteEvent(id);
            alert('Event deleted successfully!');
            router.push('/dashboard/convening-platforms/events');
        } catch (error) {
            console.error('Failed to delete event:', error);
            alert('Failed to delete event. Please try again.');
        }
    };

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const buildImageUrl = (img?: string) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `http://localhost:5001${img}`;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Conference':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Workshop':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Webinar':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Dialogue':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Friday Reviews':
                return 'bg-pink-100 text-pink-700 border-pink-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Upcoming'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#021d49] border-t-transparent mx-auto"></div>
                    <p className="text-gray-600 mt-6 text-lg font-medium">Loading event...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => router.push('/dashboard/convening-platforms/events')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </button>
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="text-6xl mb-4">😞</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">{error || 'Event Not Found'}</h2>
                        <p className="text-gray-600 text-lg">The event you're looking for doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    const img = buildImageUrl(event.image);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => router.push('/dashboard/convening-platforms/events')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                </button>

                <div className="grid gap-6">
                    {/* Main Event Card */}
                    <Card className="shadow-xl border-0 overflow-hidden">
                        {/* Image Section */}
                        {img && (
                            <div className="relative h-80 overflow-hidden">
                                <img
                                    src={img}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className={`px-4 py-2 ${getCategoryColor(event.category)} rounded-full font-semibold text-sm backdrop-blur-sm border shadow-lg`}>
                                        {event.category}
                                    </span>
                                    <span className={`px-4 py-2 ${getStatusColor(event.status)} rounded-full font-semibold text-sm backdrop-blur-sm border shadow-lg`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                        )}

                        <CardHeader className="bg-gradient-to-r from-[#021d49] to-[#021d49] text-white">
                            <CardTitle className="text-3xl">{event.title}</CardTitle>
                            <CardDescription className="text-gray-100 text-base">
                                Event Details and Information
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-8 space-y-6">
                            {/* Event Info Grid */}
                            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Calendar className="w-6 h-6 text-[#021d49]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Date</p>
                                        <p className="text-lg font-semibold text-gray-900">{formatDate(event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <Clock className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Time</p>
                                        <p className="text-lg font-semibold text-gray-900">{formatTime(event.time)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:col-span-2">
                                    <div className="p-3 bg-amber-50 rounded-lg">
                                        <MapPin className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Location</p>
                                        <p className="text-lg font-semibold text-gray-900">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Toggle */}
                            <div>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    className="w-full"
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                                </Button>
                                {showCalendar && (
                                    <div className="mt-4 border rounded-lg p-4 bg-white shadow-lg">
                                        <SimpleCalendar
                                            selectedDate={new Date(event.date)}
                                            onDateSelect={() => { }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#021d49]/10 rounded-lg">
                                        <FileText className="w-6 h-6 text-[#021d49]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Description</h3>
                                </div>
                                <div
                                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: event.description || '' }}
                                />
                            </div>

                            {/* Resources */}
                            {event.availableResources && event.availableResources.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Download className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Available Resources</h3>
                                    </div>
                                    <div className="grid gap-3">
                                        {event.availableResources.map((resource: string, idx: number) => {
                                            const resourceUrl = resource.startsWith('http') ? resource : `http://localhost:5001${resource}`;
                                            const fileName = resource.split('/').pop() || `Resource ${idx + 1}`;
                                            return (
                                                <a
                                                    key={idx}
                                                    href={resourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-xl hover:border-[#021d49] hover:bg-blue-50/50 transition-all group"
                                                >
                                                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-[#021d49]/10 transition-colors">
                                                        <FileText className="w-6 h-6 text-gray-600 group-hover:text-[#021d49]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 group-hover:text-[#021d49]">{fileName}</p>
                                                        <p className="text-sm text-gray-500">Click to download</p>
                                                    </div>
                                                    <Download className="w-5 h-5 text-gray-400 group-hover:text-[#021d49]" />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-6 border-t border-gray-200">
                                <Button
                                    onClick={() => router.push(`/dashboard/convening-platforms/events/${id}/edit`)}
                                    className="flex-1 bg-gradient-to-r from-[#021d49] to-[#021d49] hover:opacity-90 text-white"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Event
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Event
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;

