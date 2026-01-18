"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { booksService } from "@/services/booksService";

interface Book {
    _id?: string;
    title: string;
    authors?: string[];
    datePosted?: string;
    description: string;
    image?: string;
    year?: number;
}

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const data = await booksService.getAll();
            setBooks(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load books");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this book?")) return;
        try {
            await booksService.delete(id);
            setBooks(books.filter(b => b._id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Delete failed");
        }
    };

    const filtered = books.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.authors?.some(a => a.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="p-8">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Books</h1>
                <Link href="/dashboard/press/books/new" className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700">Add New</Link>
            </div>
            <input
                className="w-full mb-6 border rounded px-3 py-2"
                placeholder="Search books by title or author..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No books found. {books.length === 0 && <Link href="/dashboard/press/books/new" className="text-pink-600 hover:underline">Create your first one</Link>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                            {item.image && <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />}
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Book</span>
                                    {item.datePosted && <span className="text-xs text-gray-500">{new Date(item.datePosted).toLocaleDateString()}</span>}
                                </div>
                                <h2 className="font-semibold text-lg mb-1 line-clamp-2">{item.title}</h2>
                                {item.description && (
                                    <div className="text-sm text-gray-600 line-clamp-3 mb-2" dangerouslySetInnerHTML={{ __html: item.description.substring(0, 150) + '...' }} />
                                )}
                                {item.authors && item.authors.length > 0 && (
                                    <span className="text-xs text-gray-400 block mt-2">By {item.authors.join(", ")}</span>
                                )}
                                <div className="flex gap-2 mt-4">
                                    <Link href={`/dashboard/press/books/${item._id}`} className="flex-1 text-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">View</Link>
                                    <Link href={`/dashboard/press/books/${item._id}/edit`} className="flex-1 text-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Edit</Link>
                                    <button onClick={() => handleDelete(item._id!)} className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
