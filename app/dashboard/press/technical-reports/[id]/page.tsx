"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { technicalReportsService, TechnicalReport } from "@/services/technicalReportsService";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import { getCloudinaryDownloadUrl, getResourceFilename, isValidResourceUrl } from "@/lib/utils";
import { ArrowLeft, ZoomIn, X, Eye, Download } from "lucide-react";

export default function ViewTechnicalReport() {
    const params = useParams();
    const id = params.id as string;
    const [report, setReport] = useState<TechnicalReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageModalOpen, setImageModalOpen] = useState(false);

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
        <div className="p-6 max-w-4xl mx-auto">
            {/* Image Modal */}
            {imageModalOpen && report.image && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setImageModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setImageModalOpen(false)}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10"
                        >
                            <X className="w-6 h-6 text-gray-900" />
                        </button>
                        <img
                            src={report.image}
                            alt={report.title}
                            className="w-full h-auto rounded-lg max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Back Link */}
            <Link href="/dashboard/press/technical-reports" className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Technical Reports
            </Link>

            {/* Main Card */}
            <Card className="p-8">
                {/* Cover Image with Zoom */}
                {report.image && (
                    <div className="mb-8 relative group">
                        <img src={report.image} alt={report.title} className="w-full h-80 object-cover rounded-lg shadow-md" />
                        <button
                            onClick={() => setImageModalOpen(true)}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Click to view full-size image"
                        >
                            <ZoomIn className="w-5 h-5 text-gray-900" />
                        </button>
                    </div>
                )}

                {/* Title and Metadata */}
                <div className="mb-8 border-b pb-6">
                    <h1 className="text-3xl font-bold mb-3">{report.title}</h1>
                    {report.authors && report.authors.length > 0 && (
                        <div className="mb-2 text-gray-700 font-semibold">By: {report.authors.join(", ")}</div>
                    )}
                    <div className="text-gray-500 text-sm">
                        {report.datePosted ? new Date(report.datePosted).toLocaleDateString() : ""}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: report.description }} />

                {/* Available Resources - Below Description */}
                {report.availableResources && report.availableResources.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8 mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Eye className="w-5 h-5 text-white" />
                            </div>
                            Available Resources
                        </h2>
                        <p className="text-gray-700 mb-6 text-sm">Download or open the full report and supporting documents</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.availableResources.filter(isValidResourceUrl).map((url, idx) => (
                                <div key={idx} className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                    {/* Header */}
                                    <div className="bg-gray-50 group-hover:bg-blue-50 px-5 py-4 flex items-center gap-3 transition-colors">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                            <Download className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-900 truncate" title={getResourceFilename(url)}>
                                                {getResourceFilename(url)}
                                            </p>
                                            <p className="text-xs text-gray-500">PDF Document</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 divide-x divide-gray-200 border-t border-gray-200">
                                        <a
                                            href={getCloudinaryDownloadUrl(url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center gap-1 py-4 px-3 text-blue-600 hover:bg-blue-50 transition-colors font-semibold text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </a>
                                        <a
                                            href={getCloudinaryDownloadUrl(url)}
                                            download
                                            className="flex flex-col items-center justify-center gap-1 py-4 px-3 text-gray-700 hover:bg-gray-100 transition-colors font-semibold text-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-blue-200 bg-white/60 rounded-lg p-4 text-sm text-gray-700">
                            <p className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">ℹ️</span>
                                <span>Click <strong>"View"</strong> to open the document in a new tab, or <strong>"Download"</strong> to save it to your device.</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Edit Button */}
                <div className="mt-8 flex justify-end">
                    <Link href={`/dashboard/press/technical-reports/${report._id}/edit`}>
                        <Button className="bg-green-600 hover:bg-green-700">Edit Report</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
