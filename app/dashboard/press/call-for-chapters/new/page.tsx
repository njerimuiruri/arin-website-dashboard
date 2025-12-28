"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCallPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        postedBy: "",
        postedDate: "",
        category: "",
        excerpt: "",
        image: "",
        deadline: "",
        status: "Open"
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally save the new call
        router.push("/dashboard/press/call-for-chapters");
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Call for Book Chapters</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="postedBy" value={form.postedBy} onChange={handleChange} placeholder="Posted By" className="w-full border rounded px-3 py-2" />
                <input name="postedDate" value={form.postedDate} onChange={handleChange} placeholder="Posted Date (e.g. March 25, 2021)" className="w-full border rounded px-3 py-2" required />
                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border rounded px-3 py-2" />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <input name="deadline" value={form.deadline} onChange={handleChange} placeholder="Deadline (e.g. 2nd May 2021)" className="w-full border rounded px-3 py-2" required />
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Create</button>
            </form>
        </div>
    );
}
