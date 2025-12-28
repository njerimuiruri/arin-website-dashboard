"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const newsBriefs = [
    {
        id: 'geo-africa-workshop',
        title: 'GEO-AFRICA WORKSHOP',
        date: 'November 21, 2025',
        category: 'Events & Workshops',
        authors: 'Maria Nailantei & Florence Onyango',
        excerpt: 'Photo: Participants stood for a group photo at Emara…',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        hasImage: true
    },
    {
        id: 'climate-resilience-metrics',
        title: 'Accelerating Global Climate Resilience through Robust Adaptation Metrics',
        date: 'November 21, 2025',
        category: 'Publications',
        authors: '',
        excerpt: 'A new policy paper titled "Accelerating Global Climate Resilience through Robust Adaptation Metrics", co-authored by…',
        image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80',
        hasImage: true
    },
    {
        id: 'morocco-conference',
        title: 'ARIN Advances Climate Adaptation Measurement at International Conference in Morocco',
        date: 'October 8, 2025',
        category: 'Conferences',
        authors: 'Dr. Humphrey Agevi, Dr. Eurallyah Akinyi',
        excerpt: 'Delegates gather for a group photo during the…',
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',
        hasImage: true
    },
    {
        id: 'africa-climate-summit',
        title: 'ARIN Advocates for Locally Led Adaptation Metrics at Africa Climate Summit 2',
        date: 'September 11, 2025',
        category: 'Advocacy',
        authors: 'Florence Onyango, Maria Nalantei',
        excerpt: 'The Africa Research and Impact Network (ARIN), through its Locally Led…',
        image: 'https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=800&q=80',
        hasImage: true
    }
];

export default function EditNewsBriefPage({ params }) {
    const router = useRouter();
    const item = newsBriefs.find((i) => i.id === params.id);
    const [form, setForm] = useState(item ? {
        title: item.title,
        date: item.date,
        category: item.category,
        authors: item.authors,
        excerpt: item.excerpt,
        image: item.image,
        hasImage: item.hasImage
    } : {
        title: "",
        date: "",
        category: "",
        authors: "",
        excerpt: "",
        image: "",
        hasImage: true
    });
    if (!item) return <div className="p-8">News Brief not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the news brief
        router.push(`/dashboard/press/news-briefs/${item.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit News Brief</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. November 21, 2025)" className="w-full border rounded px-3 py-2" required />
                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border rounded px-3 py-2" />
                <input name="authors" value={form.authors} onChange={handleChange} placeholder="Authors" className="w-full border rounded px-3 py-2" />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update</button>
            </form>
        </div>
    );
}
