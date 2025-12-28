"use client";
import Link from "next/link";
import { useState } from "react";

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

export default function BooksPage() {
    const [search, setSearch] = useState("");
    const filtered = books.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Books</h1>
                <Link href="/dashboard/press/books/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search books..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <Link key={item.id} href={`/dashboard/press/books/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.category}</span>
                                <span className="text-xs text-gray-500">{item.postedDate}</span>
                            </div>
                            <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.description}</p>
                            <span className="text-xs text-gray-400">By {item.authors}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
