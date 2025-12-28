"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const copItems = [
    {
        id: 'locally-led-adaptation-metrics',
        title: 'Locally Led Adaptation Metrics Unlocking Finance with Community-Defined Indicators',
        date: 'November 10, 2025',
        year: '2025',
        author: 'Awino',
        excerpt: 'The transition to Locally Led Adaptation (LLA) in Africa is fundamentally hampered by a persistent accountability gap. Despite broad political endorsement, adaptation finance and reporting continue to…',
        tags: ['COP', 'Policy Briefs', 'Locally Led Adaptation', 'Climate Finance'],
        image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b4?w=800&q=80'
    },
    {
        id: 'climate-health-emergency',
        title: 'Climate-Health Emergency Policy Pathways for Resilience in Africa (2024)',
        date: 'November 10, 2025',
        year: '2025',
        author: 'Awino',
        excerpt: 'Africa faces a profound and immediate climate-health emergency. Climate related hazards accounted for over 56% of public health emergencies on the continent between 2001 and…',
        tags: ['COP', 'Policy Briefs', 'Climate Health', 'Resilience'],
        image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&q=80'
    },
    {
        id: 'arin-position-cop30',
        title: 'The Africa Research and Impact Network (ARIN) Position at COP30',
        date: 'November 10, 2025',
        year: '2025',
        author: 'Awino',
        excerpt: 'Driving the Global Goal on Adaptation (GGA) from the Ground Up At COP30, ARIN asserts that Africa must not only participate in, but lead…',
        tags: ['COP', 'Global Goal on Adaptation', 'COP30'],
        image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=80'
    }
];

export default function EditCopItemPage({ params }) {
    const router = useRouter();
    const item = copItems.find((i) => i.id === params.id);
    const [form, setForm] = useState(item ? {
        title: item.title,
        date: item.date,
        year: item.year,
        author: item.author,
        excerpt: item.excerpt,
        tags: item.tags.join(", "),
        image: item.image
    } : {
        title: "",
        date: "",
        year: "",
        author: "",
        excerpt: "",
        tags: "",
        image: ""
    });
    if (!item) return <div className="p-8">COP Policy Brief not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the COP item
        router.push(`/dashboard/convening-platforms/cop/${item.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit COP Policy Brief</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. November 10, 2025)" className="w-full border rounded px-3 py-2" required />
                <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full border rounded px-3 py-2" required />
                <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full border rounded px-3 py-2" required />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update</button>
            </form>
        </div>
    );
}
