"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { technicalReportsService, TechnicalReport } from "@/services/technicalReportsService";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

export default function ViewTechnicalReport() {
    const params = useParams();
    const id = params.id as string;
    const [report, setReport] = useState<TechnicalReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        technicalReportsService.getById(id)
            .then(data => {
                setReport(data);
                setError(null);
            })
            .catch(err => setError(err.message || "Failed to load report"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error || !report) return <div className="p-8 text-red-600">Technical report not found.</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <Card className="p-6">
                {report.image && (
                    <img src={report.image} alt={report.title} className="w-full h-64 object-cover rounded mb-6" />
                )}
                <h1 className="text-2xl font-bold mb-2">{report.title}</h1>
                {report.authors && report.authors.length > 0 && (
                    <div className="mb-2 text-gray-700 text-sm">By: {report.authors.join(", ")}</div>
                )}
                <div className="mb-4 text-gray-500 text-xs">
                    {report.datePosted ? new Date(report.datePosted).toLocaleDateString() : ""}
                </div>
                <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: report.description }} />
                {report.availableResources && report.availableResources.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">Resources</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {report.availableResources.map((url, idx) => (
                                <li key={idx}>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Resource {idx + 1}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="mt-8 flex justify-end">
                    <Link href={`/dashboard/press/technical-reports/${report._id}/edit`}><Button>Edit</Button></Link>
                </div>
            </Card>
        </div>
    );
}
