import React from "react";
import Link from "next/link";

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

export default function NewsBriefViewPage({ params }) {
    const item = newsBriefs.find(i => i.id === params.id);
    if (!item) return <div className="p-8">News Brief not found.</div>;
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.category}</span>
                <span className="text-xs text-gray-500">{item.date}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <div className="mb-2">
                <span className="font-semibold">Authors:</span> {item.authors}
            </div>
            <p className="text-gray-700 mb-4">{item.excerpt}</p>
            <div className="flex justify-between items-center mt-6">
                <span className="text-xs text-gray-400">Category: {item.category}</span>
                <Link href={`/dashboard/press/news-briefs/${item.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}
