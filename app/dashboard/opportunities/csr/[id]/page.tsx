
"use client";
import React, { useEffect, useState, use as useUnwrap } from "react";
import Link from "next/link";
import { getCsr } from '@/services/csrService';
import { getCloudinaryDownloadUrl, getResourceFilename, isValidResourceUrl } from "@/lib/utils";

interface CSRViewPageProps {
    params: {
        id: string;
    };
}

export default function CSRViewPage({ params }: CSRViewPageProps) {
    // Unwrap params if it's a Promise (Next.js app directory)
    // @ts-ignore
    const actualParams = typeof params.then === 'function' ? useUnwrap(params) : params;
    const [csr, setCsr] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!actualParams?.id) {
            setError('Invalid CSR ID.');
            setLoading(false);
            return;
        }
        async function fetchCsr() {
            try {
                const data = await getCsr(actualParams.id);
                if (!data) {
                    setError('CSR Activity not found.');
                } else {
                    setCsr(data);
                }
            } catch (err: any) {
                setError('Failed to load CSR.');
            } finally {
                setLoading(false);
            }
        }
        fetchCsr();
    }, [actualParams.id]);

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }
    if (error) {
        return <div className="p-8 text-red-600">{error}</div>;
    }
    if (!csr) {
        return <div className="p-8">CSR Activity not found.</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {csr.image && (
                <img src={csr.image.startsWith('http') ? csr.image : `https://api.demo.arin-africa.org${csr.image}`}
                    alt={csr.title}
                    className="w-full h-64 object-cover rounded mb-4" />
            )}
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">{csr.date ? (csr.date.substring(0, 10)) : ''}</span>
                <Link href={`/dashboard/opportunities/csr/${csr._id}/edit`} className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs">Edit</Link>
            </div>
            <h1 className="text-2xl font-bold mb-4">{csr.title}</h1>
            <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: csr.description || '' }} />
            {csr.availableResources && csr.availableResources.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">Available Resources</h2>
                    <ul className="list-disc pl-6">
                        {csr.availableResources.filter(isValidResourceUrl).map((url: string, idx: number) => (
                            <li key={idx}>
                                <a href={getCloudinaryDownloadUrl(url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{getResourceFilename(url) || `Resource ${idx + 1}`}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}