"use client";
import Link from "next/link";
import { useState } from "react";

const articles = [
    {
        id: 'health-professionals-climate',
        title: "Improving health professionals' capacity to respond to the climate crisis in Africa: outcomes of the Africa climate and health responder course",
        date: 'October 28, 2025',
        category: 'Health & Climate',
        authors: 'Danielly de P. Magalhães1*†, Cecilia Sorensen1,2†,Nicola Hamacher1, Haley Campbell1, Hannah N. W. Weinstein1,  Patrick O. Owili3, Alex R. Ario4,5, Glory M. E. Nja6,7,8,  Charles A. Michael9, Yewande Alimi9, Hervé Hien4,  Woldekidan Amde6,10, Sokhna Thiam11,…',
        excerpt: '',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
        hasImage: true
    },
    {
        id: 'air-quality-nairobi',
        title: 'Political Economy of the Air Quality Management of Nairobi City',
        date: 'August 4, 2025',
        category: 'Environmental Policy',
        authors: 'Washington Kanyangi1 Joanes Atela1 George Mwaniki2 Tom Randa3 Humphrey Agevi1,4* Eurallyah Akinyi1',
        excerpt: 'The quality of air…',
        image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&q=80',
        hasImage: true
    },
    {
        id: 'fiscal-decentralization-healthcare',
        title: 'Fiscal Decentralization and Devolved Healthcare Service Availability Outcomes in Kenya: Evidence From Panel Dynamic Approach',
        date: 'July 8, 2025',
        category: 'Health Economics',
        authors: 'Isaiah Maket a,b,* , Remmy Naibei c,d,*',
        excerpt: 'The study examined the effect of fiscal…',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        hasImage: true
    }
];

export default function JournalArticlesPage() {
    const [search, setSearch] = useState("");
    const filtered = articles.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Journal Articles</h1>
                <Link href="/dashboard/press/journal-articles/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search journal articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <Link key={item.id} href={`/dashboard/press/journal-articles/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.category}</span>
                                <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                            <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                            <span className="text-xs text-gray-400">By {item.authors}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
