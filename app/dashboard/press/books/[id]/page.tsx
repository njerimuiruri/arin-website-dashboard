"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { booksService } from "@/services/booksService";
import HtmlRenderer from "@/components/HtmlRenderer";

interface Book {
    _id?: string;
    title: string;
    authors?: string[];
    description: string;
    image?: string;
    datePosted?: string;
    availableResources?: string[];
    year?: number;
}

interface BookViewPageProps {
    params: { id: string };
}

export default function BookViewPage({ params }: BookViewPageProps) {
    const router = useRouter();
    const id = params.id;
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadBook();
    }, [id]);

    const loadBook = async () => {
        try {
            setLoading(true);
            const data = await booksService.getById(id);
            setBook(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load book");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this book?")) {
            try {
                await booksService.delete(id);
                router.push("/dashboard/press/books");
            } catch (err) {
                alert(err instanceof Error ? err.message : "Failed to delete book");
            }
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!book) return <div className="p-8">Book not found.</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {book.image && (
                <img src={book.image} alt={book.title} className="w-full h-64 object-cover rounded mb-4" />
            )}

            <div className="flex justify-between items-center mb-4">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Book</span>
                {book.datePosted && (
                    <span className="text-xs text-gray-500">{new Date(book.datePosted).toLocaleDateString()}</span>
                )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

            {book.authors && book.authors.length > 0 && (
                <div className="mb-4">
                    <span className="font-semibold text-gray-700">Authors: </span>
                    <span className="text-gray-600">{book.authors.join(", ")}</span>
                </div>
            )}

            {book.description && (
                <div className="prose max-w-none mb-6">
                    <HtmlRenderer content={book.description} />
                </div>
            )}

            {book.availableResources && book.availableResources.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded">
                    <span className="font-semibold text-gray-700 block mb-2">Available Resources:</span>
                    <ul className="space-y-2">
                        {book.availableResources.map((url, i) => (
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
                        href={`/dashboard/press/books/${id}/edit`}
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
                    href="/dashboard/press/books"
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                    Back to List
                </Link>
            </div>
        </div>
    );
}
