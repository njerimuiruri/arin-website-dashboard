"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const books = [
    {
        id: 'earth-system-governance',
        title: "Earth System Governance – Africa's Right to Development in a Climate-Constrained World",
        authors: 'Kennedy Mbeva, Reuben Makomere, Joanes Atela, Victoria Chengo and Charles Tonui',
        postedBy: 'Gordon Gogo',
        postedDate: 'December 13, 2024',
        category: 'Publications, Books',
        description: "The book is a comprehensive rendition of Africa's sustainable development…",
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
        hasImage: true
    },
    {
        id: 'transformative-pathways',
        title: 'Transformative pathways to sustainability: learning across disciplines, cultures and contexts',
        authors: 'Dinesh Abrol, Marina Apgar, Joanes Atela, Robert Byrne, Lakshmi Charli-Joseph, Victoria Chengo, Almendra Cremaschi, Rachael Durrant, Hallie Eakin, Adrian Ely, Anabel Marin, Fiona Marshall, David Ockwell, Nathan…',
        postedBy: 'Gordon Gogo',
        postedDate: 'December 11, 2024',
        category: 'Publications, Books',
        description: '',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
        hasImage: true
    }
];

export default function EditBookPage({ params }) {
    const router = useRouter();
    const item = books.find((i) => i.id === params.id);
    const [form, setForm] = useState(item ? {
        title: item.title,
        authors: item.authors,
        postedBy: item.postedBy,
        postedDate: item.postedDate,
        category: item.category,
        description: item.description,
        image: item.image,
        hasImage: item.hasImage
    } : {
        title: "",
        authors: "",
        postedBy: "",
        postedDate: "",
        category: "",
        description: "",
        image: "",
        hasImage: true
    });
    if (!item) return <div className="p-8">Book not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the book
        router.push(`/dashboard/press/books/${item.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="authors" value={form.authors} onChange={handleChange} placeholder="Authors" className="w-full border rounded px-3 py-2" required />
                <input name="postedBy" value={form.postedBy} onChange={handleChange} placeholder="Posted By" className="w-full border rounded px-3 py-2" required />
                <input name="postedDate" value={form.postedDate} onChange={handleChange} placeholder="Posted Date (e.g. December 13, 2024)" className="w-full border rounded px-3 py-2" required />
                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border rounded px-3 py-2" />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update</button>
            </form>
        </div>
    );
}
