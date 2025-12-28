"use client";
import Link from "next/link";
import { useState } from "react";

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

export default function NewsBriefsPage() {
    const [search, setSearch] = useState("");
    const filtered = newsBriefs.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">News Briefs</h1>
                <Link href="/dashboard/press/news-briefs/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search news briefs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <Link key={item.id} href={`/dashboard/press/news-briefs/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.category}</span>
                                <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                            <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.excerpt}</p>
                            <span className="text-xs text-gray-400">By {item.authors}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
