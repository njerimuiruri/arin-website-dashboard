"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const calls = [
    {
        id: 'decolonising-methodologies',
        title: 'Decolonising Methodologies to Sustainability in the Global South',
        postedBy: '',
        postedDate: 'March 25, 2021',
        category: 'Publications, Books, Call for book chapters',
        excerpt: 'Deadline for the submission of abstracts for book chapters -2nd May 2021. The Africa Research and Impact Network and its partners would like hereby invite a call for book chapters…',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
        hasImage: true,
        deadline: '2nd May 2021',
        status: 'Closed'
    },
    {
        id: 'building-africa-resilience',
        title: "Building Africa's Resilience in the Post-COVID-19 World: Lessons for Research and Development Priorities. Edited by Joanes Atela and Mark Pelling",
        postedBy: '',
        postedDate: 'July 23, 2020',
        category: 'Publications, Books, Call for book chapters',
        excerpt: 'Book Chapter Abstracts Submissions deadline: 21st August 2020, 11:59 GMT The Africa Research & Impact Network (ARIN) and its partners are pleased to invite submissions for book chapter…',
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
        hasImage: true,
        deadline: '21st August 2020',
        status: 'Closed'
    }
];

export default function EditCallPage({ params }) {
    const router = useRouter();
    const item = calls.find((i) => i.id === params.id);
    const [form, setForm] = useState(item ? {
        title: item.title,
        postedBy: item.postedBy,
        postedDate: item.postedDate,
        category: item.category,
        excerpt: item.excerpt,
        image: item.image,
        deadline: item.deadline,
        status: item.status
    } : {
        title: "",
        postedBy: "",
        postedDate: "",
        category: "",
        excerpt: "",
        image: "",
        deadline: "",
        status: "Open"
    });
    if (!item) return <div className="p-8">Call for Book Chapter not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the call
        router.push(`/dashboard/press/call-for-chapters/${item.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Call for Book Chapter</h1>
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
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update</button>
            </form>
        </div>
    );
}
