"use client";
import Link from "next/link";
import { useState } from "react";

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

export default function CallsPage() {
    const [search, setSearch] = useState("");
    const filtered = calls.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Call for Book Chapters</h1>
                <Link href="/dashboard/press/call-for-chapters/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search calls..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <Link key={item.id} href={`/dashboard/press/call-for-chapters/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.status}</span>
                                <span className="text-xs text-gray-500">Deadline: {item.deadline}</span>
                            </div>
                            <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.excerpt}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
