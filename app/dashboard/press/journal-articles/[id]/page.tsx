"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { journalArticlesService } from "@/services/journalArticlesService";

interface JournalArticle {
    _id?: string;
    title: string;
    description: string;
    authors?: string[];
    datePosted?: string;
    image?: string;
    availableResources?: string[];
    year?: number;
}

export default function JournalArticleViewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [article, setArticle] = useState<JournalArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadArticle();
    }, [id]);

    const loadArticle = async () => {
        try {
            setLoading(true);
            const data = await journalArticlesService.getById(id);
            setArticle(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load article");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this journal article?")) return;

        try {
            await journalArticlesService.delete(id);
            router.push("/dashboard/press/journal-articles");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete article");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!article) return <div className="p-8">Journal article not found.</div>;

    const dateDisplay = article.datePosted
        ? new Date(article.datePosted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Date not available';

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <Link
                        href="/dashboard/press/journal-articles"
                        className="text-pink-600 hover:text-pink-700 text-sm font-medium mb-4 inline-block"
                    >
                        ← Back to Journal Articles
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">{article.title}</h1>
                </div>
            </div>

            {/* Cover Image */}
            {article.image && (
                <div className="mb-6">
                    <img
                        src={`https://api.demo.arin-africa.org${article.image}`}
                        alt={article.title}
                        className="w-full h-96 object-cover rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* Metadata Card */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Authors</h3>
                        <p className="text-gray-900">
                            {article.authors && article.authors.length > 0
                                ? article.authors.join(", ")
                                : "No authors listed"}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Date Posted</h3>
                        <p className="text-gray-900">{dateDisplay}</p>
                    </div>
                    {article.year && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Year</h3>
                            <p className="text-gray-900">{article.year}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.description }}
                />
            </div>

            {/* Available Resources */}
            {article.availableResources && article.availableResources.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Available Resources</h2>
                    <div className="space-y-2">
                        {article.availableResources.map((url, i) => (
                            <a
                                key={i}
                                href={`https://api.demo.arin-africa.org${url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-lg border border-blue-200 transition-colors group"
                            >
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                </svg>
                                <span className="text-blue-700 font-medium group-hover:underline">
                                    {url.split("/").pop()}
                                </span>
                                <svg className="w-4 h-4 text-blue-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
                <Link
                    href={`/dashboard/press/journal-articles/${id}/edit`}
                    className="flex-1 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 text-center transition-colors"
                >
                    Edit Article
                </Link>
                <button
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                    Delete
                </button>
                <Link
                    href="/dashboard/press/journal-articles"
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-center transition-colors"
                >
                    Back
                </Link>
            </div>
        </div>
    );
}
