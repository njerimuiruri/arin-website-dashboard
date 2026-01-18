"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { annualReportsService } from "@/services/annualReportsService";
import HtmlRenderer from "@/components/HtmlRenderer";

export default function AnnualReportViewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadReport();
    }, [id]);

    const loadReport = async () => {
        try {
            setLoading(true);
            const data = await annualReportsService.getById(id);
            setReport(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load annual report");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this annual report?")) {
            try {
                await annualReportsService.delete(id);
                router.push("/dashboard/press/annual-reports");
            } catch (err) {
                alert(err instanceof Error ? err.message : "Failed to delete annual report");
            }
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!report) return <div className="p-8">Annual Report not found.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {report.image && (
                <img src={report.image} alt={report.title} className="w-full h-64 object-cover rounded mb-4" />
            )}

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                    {report.year && (
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{report.year}</span>
                    )}
                    {report.category && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{report.category}</span>
                    )}
                </div>
                {report.date && (
                    <span className="text-xs text-gray-500">{new Date(report.date).toLocaleDateString()}</span>
                )}
            </div>

            <h1 className="text-3xl font-bold mb-6">{report.title}</h1>

            {report.description && (
                <div className="prose max-w-none mb-6">
                    <HtmlRenderer content={report.description} />
                </div>
            )}

            {report.availableResources && report.availableResources.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded">
                    <span className="font-semibold text-gray-700 block mb-2">Available Resources:</span>
                    <ul className="space-y-2">
                        {report.availableResources.map((url: string, i: number) => (
                            <li key={i}>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                                    📄 {url.split("/").pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <div className="flex gap-2">
                    <Link
                        href={`/dashboard/press/annual-reports/${id}/edit`}
                        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
                <Link
                    href="/dashboard/press/annual-reports"
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                    Back to List
                </Link>
            </div>
        </div>
    );
}
