"use client";
import Link from "next/link";
import { useState } from "react";

const vacancies = [
    {
        id: 'research-fellow-climate',
        title: 'Research Fellow - Climate Adaptation',
        location: 'Nairobi, Kenya',
        type: 'Full-time',
        deadline: 'January 31, 2025',
        postedDate: 'December 15, 2024',
        status: 'Open',
        salary: 'Competitive',
        excerpt: 'ARIN is seeking a highly motivated Research Fellow to lead climate adaptation research projects across East Africa. The ideal candidate will have expertise in climate science, policy analysis, and community engagement.',
        requirements: ['PhD in Climate Science, Environmental Studies, or related field', '5+ years research experience', 'Strong publication record'],
        tags: ['Research', 'Climate', 'Full-time'],
        poster: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
    },
    {
        id: 'policy-analyst',
        title: 'Policy Analyst - Health Systems',
        location: 'Accra, Ghana',
        type: 'Full-time',
        deadline: 'February 15, 2025',
        postedDate: 'December 10, 2024',
        status: 'Open',
        salary: '$45,000 - $60,000',
        excerpt: 'We are looking for a Policy Analyst to support our health systems strengthening initiatives. This role involves analyzing health policies, conducting stakeholder consultations, and developing policy briefs.',
        requirements: ['Master\'s degree in Public Health or related field', 'Policy analysis experience', 'Excellent writing skills'],
        tags: ['Policy', 'Health', 'Full-time'],
        poster: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
    },
    {
        id: 'communications-officer',
        title: 'Communications Officer',
        location: 'Remote',
        type: 'Contract',
        deadline: 'January 20, 2025',
        postedDate: 'December 5, 2024',
        status: 'Open',
        salary: 'Negotiable',
        excerpt: 'ARIN seeks a creative Communications Officer to manage our digital presence, develop content strategies, and engage with stakeholders across multiple platforms.',
        requirements: ['Bachelor\'s degree in Communications or Journalism', '3+ years experience', 'Social media expertise'],
        tags: ['Communications', 'Remote', 'Contract'],
        poster: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80'
    },
    {
        id: 'data-scientist',
        title: 'Data Scientist - Climate Modeling',
        location: 'Kigali, Rwanda',
        type: 'Full-time',
        deadline: 'March 1, 2025',
        postedDate: 'December 1, 2024',
        status: 'Open',
        salary: '$50,000 - $70,000',
        excerpt: 'Join our team as a Data Scientist to develop climate models and analyze large datasets for evidence-based policy recommendations across Africa.',
        requirements: ['Master\'s or PhD in Data Science, Statistics, or related field', 'Python/R programming', 'Machine learning experience'],
        tags: ['Data Science', 'Climate', 'Full-time'],
        poster: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    },
    {
        id: 'program-coordinator',
        title: 'Program Coordinator - Youth Engagement',
        location: 'Lagos, Nigeria',
        type: 'Part-time',
        deadline: 'November 30, 2024',
        postedDate: 'October 15, 2024',
        status: 'Closed',
        salary: '$30,000 - $40,000',
        excerpt: 'Support the coordination of youth-focused climate action programs, including workshop organization, stakeholder engagement, and monitoring and evaluation.',
        requirements: ['Bachelor\'s degree in relevant field', 'Project management experience', 'Youth engagement background'],
        tags: ['Program Management', 'Youth', 'Part-time'],
        poster: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
    }
];

export default function VacanciesPage() {
    const [search, setSearch] = useState("");
    const filtered = vacancies.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    const openCount = vacancies.filter(v => v.status === "Open").length;
    const closedCount = vacancies.filter(v => v.status === "Closed").length;
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vacancies</h1>
                <Link href="/dashboard/opportunities/vacancies/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <div className="flex gap-4 mb-6">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded font-semibold">Open: {openCount}</div>
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold">Closed: {closedCount}</div>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search vacancies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <Link key={item.id} href={`/dashboard/opportunities/vacancies/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img src={item.poster} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs px-2 py-1 rounded ${item.status === "Open" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{item.status}</span>
                                <span className="text-xs text-gray-500">Deadline: {item.deadline}</span>
                            </div>
                            <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.excerpt}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{tag}</span>
                                ))}
                            </div>
                            <span className="text-xs text-gray-400">{item.location}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
