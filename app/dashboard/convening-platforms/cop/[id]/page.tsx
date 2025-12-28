import React from "react";
import Link from "next/link";

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

export default function CopItemViewPage({ params }) {
    const item = copItems.find(i => i.id === params.id);
    if (!item) return <div className="p-8">COP Policy Brief not found.</div>;
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.year}</span>
                <span className="text-xs text-gray-500">{item.date}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <p className="text-gray-700 mb-4">{item.excerpt}</p>
            <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{tag}</span>
                ))}
            </div>
            <div className="flex justify-between items-center mt-6">
                <span className="text-xs text-gray-400">By {item.author}</span>
                <Link href={`/dashboard/convening-platforms/cop/${item.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}
