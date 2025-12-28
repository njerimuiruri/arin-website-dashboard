"use client";
import Link from "next/link";
import { useState } from "react";

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

export default function CSRPage() {
    const [search, setSearch] = useState("");
    const filtered = csrActivities.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">CSR Activities</h1>
                <Link href="/dashboard/opportunities/csr/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search CSR activities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <Link key={item.id} href={`/dashboard/opportunities/csr/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.category}</span>
                                <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                            <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.excerpt}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{tag}</span>
                                ))}
                            </div>
                            <span className="text-xs text-gray-400">By {item.author}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
