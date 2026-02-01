import React from "react";
import Link from "next/link";

interface CSRActivity {
    id: string;
    title: string;
    date: string;
    year: string;
    author: string;
    excerpt: string;
    tags: string[];
    image: string;
    category: string;
}

const csrActivities: CSRActivity[] = [
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

interface CSRViewPageProps {
    params: {
        id: string;
    };
}

export default function CSRViewPage({ params }: CSRViewPageProps) {
    const item = csrActivities.find(i => i.id === params.id);

    if (!item) {
        return <div className="p-8">CSR Activity not found.</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.category}</span>
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
                <Link href={`/dashboard/opportunities/csr/${item.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}