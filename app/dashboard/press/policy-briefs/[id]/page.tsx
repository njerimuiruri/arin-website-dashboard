"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { policyBriefsService } from "@/services/policyBriefsService";

export default function ViewPolicyBrief() {
    const params = useParams();
    const id = params.id as string;
    const [brief, setBrief] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBrief() {
            try {
                setLoading(true);
                const data = await policyBriefsService.getById(id);
                setBrief(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load policy brief");
            } finally {
                setLoading(false);
            }
        }
        fetchBrief();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!brief) return null;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
                {brief.coverImage && (
                    <img src={brief.coverImage} alt={brief.title} className="w-full h-56 object-cover rounded mb-4" />
                )}
                <h1 className="text-2xl font-bold mb-2">{brief.title}</h1>
                <p className="text-gray-500 mb-2">{brief.datePosted ? new Date(brief.datePosted).toLocaleDateString() : null}</p>
                <div className="prose mb-4" dangerouslySetInnerHTML={{ __html: brief.description }} />
                {brief.availableResources && brief.availableResources.length > 0 && (
                    <div className="mb-4">
                        <h2 className="font-semibold mb-2">Resources</h2>
                        <ul className="list-disc pl-5">
                            {brief.availableResources.map((url: string, i: number) => (
                                <li key={i}>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {url.split("/").pop()}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex gap-2">
                    <Link href={`/dashboard/press/policy-briefs/${brief._id}/edit`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</Link>
                    <Link href="/dashboard/press/policy-briefs" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Back</Link>
                </div>
            </div>
        </div>
    );
}
