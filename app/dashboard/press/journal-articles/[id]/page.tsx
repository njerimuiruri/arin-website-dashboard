import React from "react";
import Link from "next/link";

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

export default function JournalArticleViewPage({ params }) {
    const item = articles.find(i => i.id === params.id);
    if (!item) return <div className="p-8">Journal Article not found.</div>;
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
                <Link href={`/dashboard/press/journal-articles/${item.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}
