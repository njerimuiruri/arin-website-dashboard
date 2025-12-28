"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewConferencePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        date: "",
        year: "",
        author: "",
        excerpt: "",
        tags: "",
        image: "",
        edition: ""
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally save the new conference
        router.push("/dashboard/convening-platforms/conferences");
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Conference</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. July 29, 2024)" className="w-full border rounded px-3 py-2" required />
                <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full border rounded px-3 py-2" required />
                <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full border rounded px-3 py-2" required />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <input name="edition" value={form.edition} onChange={handleChange} placeholder="Edition (e.g. 4th Annual)" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Create Conference</button>
            </form>
        </div>
    );
}
