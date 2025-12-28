import React from "react";
import Link from "next/link";

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

export default function VacancyViewPage({ params }) {
    const item = vacancies.find(i => i.id === params.id);
    if (!item) return <div className="p-8">Vacancy not found.</div>;
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <img src={item.poster} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />
            <div className="flex justify-between items-center mb-2">
                <span className={`text-xs px-2 py-1 rounded ${item.status === "Open" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{item.status}</span>
                <span className="text-xs text-gray-500">Deadline: {item.deadline}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <p className="text-gray-700 mb-4">{item.excerpt}</p>
            <div className="mb-2">
                <span className="font-semibold">Location:</span> {item.location}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Type:</span> {item.type}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Salary:</span> {item.salary}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Requirements:</span>
                <ul className="list-disc ml-6">
                    {item.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                </ul>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{tag}</span>
                ))}
            </div>
            <div className="flex justify-between items-center mt-6">
                <span className="text-xs text-gray-400">Posted: {item.postedDate}</span>
                <Link href={`/dashboard/opportunities/vacancies/${item.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
        </div>
    );
}
