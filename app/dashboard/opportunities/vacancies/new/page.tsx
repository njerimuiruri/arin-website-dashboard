"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewVacancyPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        location: "",
        type: "Full-time",
        deadline: "",
        postedDate: "",
        status: "Open",
        salary: "",
        excerpt: "",
        requirements: "",
        tags: "",
        poster: ""
    });
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally save the new vacancy
        router.push("/dashboard/opportunities/vacancies");
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Vacancy</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border rounded px-3 py-2" required />
                <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                </select>
                <input name="deadline" value={form.deadline} onChange={handleChange} placeholder="Deadline (e.g. January 31, 2025)" className="w-full border rounded px-3 py-2" required />
                <input name="postedDate" value={form.postedDate} onChange={handleChange} placeholder="Posted Date (e.g. December 15, 2024)" className="w-full border rounded px-3 py-2" required />
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                </select>
                <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" className="w-full border rounded px-3 py-2" />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="poster" value={form.poster} onChange={handleChange} placeholder="Poster Image URL" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Create</button>
            </form>
        </div>
    );
}
