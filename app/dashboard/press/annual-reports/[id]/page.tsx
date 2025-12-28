import React from "react";
import Link from "next/link";

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

export default function AnnualReportViewPage({ params }) {
    const item = reports.find(i => i.id === params.id);
    if (!item) return <div className="p-8">Annual Report not found.</div>;
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{item.year}</span>
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
                <div className="flex gap-2">
                    <a href={item.pdfLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">View PDF</a>
                    <Link href={`/dashboard/press/annual-reports/${item.id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
                </div>
            </div>
        </div>
    );
}
