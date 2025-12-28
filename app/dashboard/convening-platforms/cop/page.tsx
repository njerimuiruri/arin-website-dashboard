"use client";
import Link from "next/link";
import { useState } from "react";

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

export default function CopPage() {
    const [search, setSearch] = useState("");
    const filtered = copItems.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">COP Policy Briefs</h1>
                <Link href="/dashboard/convening-platforms/cop/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search COP items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <Link key={item.id} href={`/dashboard/convening-platforms/cop/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.year}</span>
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
