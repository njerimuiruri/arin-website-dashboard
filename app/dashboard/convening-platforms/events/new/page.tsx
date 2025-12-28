"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        date: "",
        location: "",
        excerpt: "",
        tags: "",
        status: "Upcoming"
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally save the event
        router.push("/dashboard/convening-platforms/events");
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Event</h1>
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
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Create Event</button>
            </form>
        </div>
    );
}
