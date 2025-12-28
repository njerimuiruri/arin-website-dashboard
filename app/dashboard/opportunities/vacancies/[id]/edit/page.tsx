"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function EditVacancyPage({ params }) {
    const router = useRouter();
    const item = vacancies.find((i) => i.id === params.id);
    const [form, setForm] = useState(item ? {
        title: item.title,
        location: item.location,
        type: item.type,
        deadline: item.deadline,
        postedDate: item.postedDate,
        status: item.status,
        salary: item.salary,
        excerpt: item.excerpt,
        requirements: item.requirements.join(", "),
        tags: item.tags.join(", "),
        poster: item.poster
    } : {
        title: "",
        location: "",
        type: "Full-time",
        deadline: "",
        postedDate: "",
        status: "Open",
        salary: "",
        excerpt: "",
        requirements: "",
        tags: "",
        poster: ""
    });
    if (!item) return <div className="p-8">Vacancy not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the vacancy
        router.push(`/dashboard/opportunities/vacancies/${item.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Vacancy</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border rounded px-3 py-2" required />
                <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                </select>
                <input name="deadline" value={form.deadline} onChange={handleChange} placeholder="Deadline (e.g. January 31, 2025)" className="w-full border rounded px-3 py-2" required />
                <input name="postedDate" value={form.postedDate} onChange={handleChange} placeholder="Posted Date (e.g. December 15, 2024)" className="w-full border rounded px-3 py-2" required />
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                </select>
                <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" className="w-full border rounded px-3 py-2" />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="poster" value={form.poster} onChange={handleChange} placeholder="Poster Image URL" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update</button>
            </form>
        </div>
    );
}
