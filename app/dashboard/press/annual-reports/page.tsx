"use client";
import Link from "next/link";
import { useState } from "react";

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

export default function AnnualReportsPage() {
    const [search, setSearch] = useState("");
    const filtered = reports.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Annual Reports</h1>
                <Link href="/dashboard/press/annual-reports/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search annual reports..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <Link key={item.id} href={`/dashboard/press/annual-reports/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.year}</span>
                                <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                            <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-2">{item.excerpt}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{tag}</span>
                                ))}
                            </div>
                            <span className="text-xs text-gray-400">By {item.author}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
