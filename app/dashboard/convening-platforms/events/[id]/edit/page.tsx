"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function EditEventPage({ params }) {
    const router = useRouter();
    const event = events.find((e) => e.id === params.id);
    const [form, setForm] = useState(event ? {
        title: event.title,
        date: event.date,
        location: event.location,
        excerpt: event.excerpt,
        tags: event.tags.join(", "),
        status: event.status
    } : {
        title: "",
        date: "",
        location: "",
        excerpt: "",
        tags: "",
        status: "Upcoming"
    });
    if (!event) return <div className="p-8">Event not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the event
        router.push(`/dashboard/convening-platforms/events/${event.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. September 15, 2025)" className="w-full border rounded px-3 py-2" required />
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border rounded px-3 py-2" required />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update Event</button>
            </form>
        </div>
    );
}
