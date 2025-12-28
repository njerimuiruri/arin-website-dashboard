import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';

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

export default function EventDetailsPage({ params }) {
    const event = events.find((e) => e.id === params.id);
    if (!event) return notFound();
    return (
        <div className="p-8 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-pink-900 mb-2">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-xs mt-2 text-pink-700">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                        <span className="mx-1">•</span>
                        {event.location}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-base text-pink-800">{event.excerpt}</p>
                    <div className="mb-2 flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="mb-4 text-xs font-medium text-blue-600">Status: {event.status}</div>
                </CardContent>
                <CardFooter>
                    <a href={`/dashboard/convening-platforms/events/${event.id}/edit`} className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Edit Event</a>
                </CardFooter>
            </Card>
        </div>
    );
}
