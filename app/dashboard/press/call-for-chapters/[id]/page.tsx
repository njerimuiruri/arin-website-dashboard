import React from "react";
import Link from "next/link";

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

export default function CallViewPage({ params }) {
    const item = calls.find(i => i.id === params.id);
    if (!item) return <div className="p-8">Call for Book Chapter not found.</div>;
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.status}</span>
                <span className="text-xs text-gray-500">Deadline: {item.deadline}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <p className="text-gray-700 mb-4">{item.excerpt}</p>
            <div className="flex justify-between items-center mt-6">
                <span className="text-xs text-gray-400">Posted: {item.postedDate}</span>
                <Link href={`/dashboard/press/call-for-chapters/${item.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}
