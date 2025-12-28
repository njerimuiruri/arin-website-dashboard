"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function EditJournalArticlePage({ params }) {
    const router = useRouter();
    const item = articles.find((i) => i.id === params.id);
    const [form, setForm] = useState(item ? {
        title: item.title,
        date: item.date,
        category: item.category,
        authors: item.authors,
        excerpt: item.excerpt,
        image: item.image,
        hasImage: item.hasImage
    } : {
        title: "",
        date: "",
        category: "",
        authors: "",
        excerpt: "",
        image: "",
        hasImage: true
    });
    if (!item) return <div className="p-8">Journal Article not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the article
        router.push(`/dashboard/press/journal-articles/${item.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Journal Article</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. October 28, 2025)" className="w-full border rounded px-3 py-2" required />
                <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full border rounded px-3 py-2" />
                <input name="authors" value={form.authors} onChange={handleChange} placeholder="Authors" className="w-full border rounded px-3 py-2" required />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update</button>
            </form>
        </div>
    );
}
