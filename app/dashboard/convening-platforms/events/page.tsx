"use client";
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, Tag, CheckCircle2, Clock } from 'lucide-react';
import Link from "next/link";

const events = [
    {
        id: 'arin-annual-summit-2025',
        title: 'ARIN Annual Summit 2025',
        date: 'September 15, 2025',
        location: 'Nairobi, Kenya',
        excerpt: 'The ARIN Annual Summit brings together climate and sustainability leaders from across Africa to share research, policy, and innovation.',
        tags: ['Summit', 'Climate', 'Africa'],
        status: 'Upcoming'
    },
    {
        id: 'youth-innovation-forum',
        title: 'Youth Innovation Forum',
        date: 'July 10, 2025',
        location: 'Accra, Ghana',
        excerpt: 'A forum for young innovators to showcase solutions for sustainable development and climate adaptation.',
        tags: ['Youth', 'Innovation', 'Forum'],
        status: 'Upcoming'
    },
    {
        id: 'policy-dialogue-2024',
        title: 'Policy Dialogue on Climate Finance 2024',
        date: 'November 20, 2024',
        location: 'Virtual',
        excerpt: 'A virtual event focused on climate finance mechanisms and policy recommendations for African nations.',
        tags: ['Policy', 'Finance', 'Virtual'],
        status: 'Completed'
    }
];

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-pink-900 mb-2">Events</h1>
                        <p className="text-pink-700">Explore and manage ARIN events and summits</p>
                    </div>
                    <Link href="/dashboard/convening-platforms/events/new">
                        <Button className="bg-pink-600 hover:bg-pink-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Event
                        </Button>
                    </Link>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pink-400" />
                                <Input
                                    placeholder="Search events by title, description, or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="text-sm text-pink-700">
                    Showing <span className="font-semibold text-pink-900">{filteredEvents.length}</span> of {events.length} events
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <Badge variant={event.status === 'Upcoming' ? 'default' : 'secondary'} className={event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}>
                                        {event.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight text-pink-900">
                                    {event.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs mt-2">
                                    <Calendar className="h-3 w-3" />
                                    {event.date}
                                    <span className="mx-1">•</span>
                                    {event.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-pink-700 line-clamp-3">{event.excerpt}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {event.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/dashboard/convening-platforms/events/${event.id}`} className="w-full">
                                    <Button variant="ghost" className="w-full text-pink-700 hover:text-pink-900 hover:bg-pink-50">
                                        View Details →
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {filteredEvents.length === 0 && (
                    <Card className="p-12">
                        <div className="text-center">
                            <Search className="h-12 w-12 text-pink-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-pink-900 mb-2">No events found</h3>
                            <p className="text-pink-700">Try adjusting your search</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
