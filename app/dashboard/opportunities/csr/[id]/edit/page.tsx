"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const csrActivities = [
    {
        id: 'odhong-football-club',
        title: 'The Inauguration of Odhong Football Club in Nyakach-Kisumu County by the ARIN Convener Dr. Joanes Atela',
        date: 'May 31, 2021',
        year: '2021',
        author: 'ARIN Team',
        excerpt: 'In support of youth empowerment, the ARIN Convener Dr Joanes Atela was joined by ARIN…',
        tags: ['Youth Empowerment', 'Sports', 'Community Development'],
        image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
        category: 'Youth Empowerment'
    }
];

interface EditCSRPageProps {
    params: { id: string };
}

export default function EditCSRPage({ params }: EditCSRPageProps) {
    const router = useRouter();
    const item = csrActivities.find((i) => i.id === params.id);
    const [form, setForm] = useState(item ? {
        title: item.title,
        date: item.date,
        year: item.year,
        author: item.author,
        excerpt: item.excerpt,
        tags: item.tags.join(", "),
        image: item.image,
        category: item.category
    } : {
        title: "",
        date: "",
        year: "",
        author: "",
        excerpt: "",
        tags: "",
        image: "",
        category: ""
    });
    if (!item) return <div className="p-8">CSR Activity not found.</div>;
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would normally update the CSR activity
        router.push(`/dashboard/opportunities/csr/${item.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit CSR Activity</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. May 31, 2021)" className="w-full border rounded px-3 py-2" required />
                <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full border rounded px-3 py-2" required />
                <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full border rounded px-3 py-2" required />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update</button>
            </form>
        </div>
    );
}
