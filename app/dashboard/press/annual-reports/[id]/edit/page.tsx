"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const reports = [
    {
        id: 'annual-report-2023',
        title: 'ARIN ANNUAL REPORT 2023',
        date: 'June 10, 2025',
        year: '2023',
        author: 'Awino',
        excerpt: 'This document encapsulates our collective journey in advancing knowledge, fostering innovation, and making a meaningful impact on society.  At…',
        tags: ['Annual Reports', 'Publications'],
        image: '/annualreport2023.png',
        pdfLink: '/documents/ARIN-Annual-Report-2023.pdf'
    },
    {
        id: 'annual-report-2022',
        title: 'ARIN ANNUAL REPORT 2022',
        date: 'April 22, 2023',
        year: '2022',
        author: 'Erick',
        excerpt: 'This report provides the key highlights and achievements realised by the Africa Research & Impact Network (ARIN) during the year 2022. The report highlights some of the project activities…',
        tags: ['Annual Reports', 'Publications'],
        image: '/annualreport2022.png',
        pdfLink: '/documents/ARIN-ANNUAL-REPORT-2022_Consolidating-Research-Evidence-for-Impact.pdf'
    }
];

export default function EditAnnualReportPage({ params }) {
    const router = useRouter();
    const item = reports.find((i) => i.id === params.id);
    const [form, setForm] = useState(item ? {
        title: item.title,
        date: item.date,
        year: item.year,
        author: item.author,
        excerpt: item.excerpt,
        tags: item.tags.join(", "),
        image: item.image,
        pdfLink: item.pdfLink
    } : {
        title: "",
        date: "",
        year: "",
        author: "",
        excerpt: "",
        tags: "",
        image: "",
        pdfLink: ""
    });
    if (!item) return <div className="p-8">Annual Report not found.</div>;
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally update the report
        router.push(`/dashboard/press/annual-reports/${item.id}`);
    };
    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Annual Report</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border rounded px-3 py-2" required />
                <input name="date" value={form.date} onChange={handleChange} placeholder="Date (e.g. June 10, 2025)" className="w-full border rounded px-3 py-2" required />
                <input name="year" value={form.year} onChange={handleChange} placeholder="Year" className="w-full border rounded px-3 py-2" required />
                <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full border rounded px-3 py-2" required />
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Excerpt" className="w-full border rounded px-3 py-2" required />
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border rounded px-3 py-2" />
                <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL or path" className="w-full border rounded px-3 py-2" />
                <input name="pdfLink" value={form.pdfLink} onChange={handleChange} placeholder="PDF Link" className="w-full border rounded px-3 py-2" />
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Update</button>
            </form>
        </div>
    );
}
