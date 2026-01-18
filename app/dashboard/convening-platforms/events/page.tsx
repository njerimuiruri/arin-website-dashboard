"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import Link from "next/link";
import { getEvents, deleteEvent } from '@/services/eventsService';

export default function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    // Fetch events
    useEffect(() => {
        async function fetch() {
            try {
                const data = await getEvents();
                console.log('Fetched events:', data);
                setEvents(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load events');
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    // Get unique categories and statuses
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(events.map(e => e.category)));
        return ['All', ...uniqueCategories];
    }, [events]);

    const statuses = useMemo(() => {
        const uniqueStatuses = Array.from(new Set(events.map(e => e.status)));
        return ['All', ...uniqueStatuses];
    }, [events]);

    // Filter events
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
            const matchesStatus = selectedStatus === 'All' || event.status === selectedStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [searchQuery, selectedCategory, selectedStatus, events]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            await deleteEvent(id);
            setEvents(events.filter(e => e._id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Conference': 'bg-blue-100 text-blue-800',
            'Workshop': 'bg-green-100 text-green-800',
            'Webinar': 'bg-purple-100 text-purple-800',
            'Dialogue': 'bg-yellow-100 text-yellow-800',
            'Friday Reviews': 'bg-pink-100 text-pink-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-yellow-900 mb-2">Events</h1>
                        <p className="text-yellow-700">Manage your events and webinars</p>
                    </div>
                    <Link href="/dashboard/convening-platforms/events/new">
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Event
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Search events by title or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-600 focus:outline-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yellow-600 focus:outline-none"
                                    >
                                        {statuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loading State */}
                {loading && <div className="text-center py-12">Loading events...</div>}

                {/* Error State */}
                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">{error}</div>}

                {/* Empty State */}
                {!loading && !error && filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No events found</p>
                    </div>
                )}

                {/* Events List */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {filteredEvents.map((event) => (
                            <Card key={event._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={getCategoryColor(event.category)}>
                                                    {event.category}
                                                </Badge>
                                                <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'}>
                                                    {event.status}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-yellow-900">{event.title}</CardTitle>
                                            <CardDescription className="mt-2">
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(event.date)} at {event.time}
                                                    </div>
                                                    <div>📍 {event.location}</div>
                                                </div>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/convening-platforms/events/${event._id}`)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/convening-platforms/events/${event._id}/edit`)}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(event._id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
