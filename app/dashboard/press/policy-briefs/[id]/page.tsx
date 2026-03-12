"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { policyBriefsService } from "@/services/policyBriefsService";
import { FileText, ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidResourceUrl(url: unknown): url is string {
    if (typeof url !== "string" || url.trim().length === 0) return false;
    try { new URL(url); return true; } catch { return false; }
}

/**
 * Extracts the original filename from a Cloudinary raw URL.
 * e.g. https://res.cloudinary.com/xxx/raw/upload/v123/.../my-doc.pdf
 * returns "my-doc.pdf"
 */
function getResourceFilename(url: string, fallback = "Open Resource"): string {
    if (!url) return fallback;
    try {
        const pathname = new URL(url).pathname;
        const raw = pathname.split("/").pop() ?? "";
        const decoded = decodeURIComponent(raw.split("?")[0]);
        return decoded || fallback;
    } catch {
        const raw = url.split("/").pop() ?? "";
        return decodeURIComponent(raw.split("?")[0]) || fallback;
    }
}

/**
 * Returns the raw Cloudinary URL as-is (no fl_attachment).
 * This allows the browser to open the PDF in a new tab instead of
 * triggering a file download / opening the file explorer.
 */
function getViewUrl(url: string): string {
    if (!url) return "";
    // Strip fl_attachment if it was previously added
    return url.replace("/upload/fl_attachment/", "/upload/");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

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

    const resources: string[] = Array.isArray(brief.availableResources)
        ? brief.availableResources.filter(isValidResourceUrl)
        : [];

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">

                {/* Cover image */}
                {(brief.image || brief.coverImage) && (
                    <img
                        src={brief.image || brief.coverImage}
                        alt={brief.title}
                        className="w-full h-56 object-cover rounded mb-4"
                    />
                )}

                {/* Title & date */}
                <h1 className="text-2xl font-bold mb-2">{brief.title}</h1>
                {brief.datePosted && (
                    <p className="text-gray-500 mb-4 text-sm">
                        {new Date(brief.datePosted).toLocaleDateString(undefined, {
                            year: "numeric", month: "long", day: "numeric",
                        })}
                    </p>
                )}

                {/* Rich-text description */}
                {brief.description && (
                    <div
                        className="prose prose-lg max-w-none mb-6"
                        dangerouslySetInnerHTML={{ __html: brief.description }}
                    />
                )}

                {/* Available Resources */}
                {resources.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold">Available Resources</h2>
                        </div>

                        <ul className="space-y-2">
                            {resources.map((url, i) => {
                                const filename = getResourceFilename(url, `Resource ${i + 1}`);
                                const viewUrl = getViewUrl(url);

                                return (
                                    <li key={i}>
                                        <a
                                            href={viewUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                                        >
                                            <div className="bg-blue-100 p-2 rounded group-hover:bg-blue-200 transition-colors shrink-0">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-medium text-blue-700 group-hover:text-blue-900 block truncate">
                                                    {filename}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Click to open in new tab
                                                </span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Link
                        href={`/dashboard/press/policy-briefs/${brief._id}/edit`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                        Edit
                    </Link>
                    <Link
                        href="/dashboard/press/policy-briefs"
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium"
                    >
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
}