import React from "react";
import Link from "next/link";

const books = [
    {
        id: 'earth-system-governance',
        title: "Earth System Governance – Africa's Right to Development in a Climate-Constrained World",
        authors: 'Kennedy Mbeva, Reuben Makomere, Joanes Atela, Victoria Chengo and Charles Tonui',
        postedBy: 'Gordon Gogo',
        postedDate: 'December 13, 2024',
        category: 'Publications, Books',
        description: "The book is a comprehensive rendition of Africa's sustainable development…",
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80',
        hasImage: true
    },
    {
        id: 'transformative-pathways',
        title: 'Transformative pathways to sustainability: learning across disciplines, cultures and contexts',
        authors: 'Dinesh Abrol, Marina Apgar, Joanes Atela, Robert Byrne, Lakshmi Charli-Joseph, Victoria Chengo, Almendra Cremaschi, Rachael Durrant, Hallie Eakin, Adrian Ely, Anabel Marin, Fiona Marshall, David Ockwell, Nathan…',
        postedBy: 'Gordon Gogo',
        postedDate: 'December 11, 2024',
        category: 'Publications, Books',
        description: '',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
        hasImage: true
    }
];

export default function BookViewPage({ params }) {
    const item = books.find(i => i.id === params.id);
    if (!item) return <div className="p-8">Book not found.</div>;
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.category}</span>
                <span className="text-xs text-gray-500">{item.postedDate}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <p className="text-gray-700 mb-4">{item.description}</p>
            <div className="mb-2">
                <span className="font-semibold">Authors:</span> {item.authors}
            </div>
            <div className="flex justify-between items-center mt-6">
                <span className="text-xs text-gray-400">Posted by {item.postedBy}</span>
                <Link href={`/dashboard/press/books/${item.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}
