"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBookPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        authors: "",
        postedBy: "",
        postedDate: "",
        category: "",
        description: "",
        image: "",
        hasImage: true
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally save the new book
        router.push("/dashboard/press/books");
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="authors" value={form.authors} onChange={handleChange} placeholder="Authors" className="w-full border rounded px-3 py-2" required />
                <input name="postedBy" value={form.postedBy} onChange={handleChange} placeholder="Posted By" className="w-full border rounded px-3 py-2" required />
                <input name="postedDate" value={form.postedDate} onChange={handleChange} placeholder="Posted Date (e.g. December 13, 2024)" className="w-full border rounded px-3 py-2" required />
                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border rounded px-3 py-2" />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Create</button>
            </form>
        </div>
    );
}
