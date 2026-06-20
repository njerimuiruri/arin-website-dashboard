"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useParams, useRouter } from "next/navigation";
import { booksService } from "@/services/booksService";
import { getCloudinaryDownloadUrl, getResourceFilename, isValidResourceUrl } from "@/lib/utils";

declare global {
    interface Window {
        PaystackPop: {
            setup: (options: Record<string, unknown>) => { openIframe: () => void };
        };
    }
}

interface Book {
    _id?: string;
    title: string;
    authors?: string[];
    description: string;
    image?: string;
    datePosted?: string;
    availableResources?: string[];
    year?: number;
    embargoDate?: string;
    price?: number;
    currency?: string;
}

export default function BookViewPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [lightbox, setLightbox] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [payModal, setPayModal] = useState<"cart" | "buy" | null>(null);
    const [email, setEmail] = useState("");
    const [paying, setPaying] = useState(false);

    useEffect(() => { loadBook(); }, [id]);

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

    const initiatePaystack = (mode: "cart" | "buy") => {
        if (!book?.price) return;
        if (!email.trim() || !email.includes("@")) {
            alert("Please enter a valid email address.");
            return;
        }
        setPaying(true);

        const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
        const currency = book.currency || "USD";
        // Paystack expects amount in the smallest unit (cents for USD, kobo for NGN, pesewas for GHS)
        const unitMultiplier = currency === "NGN" ? 100 : 100;
        const totalAmount = Math.round(book.price * quantity * unitMultiplier);

        const handler = window.PaystackPop.setup({
            key: paystackKey,
            email: email.trim(),
            amount: totalAmount,
            currency,
            ref: `ARIN-${Date.now()}-${Math.floor(Math.random() * 99999)}`,
            metadata: {
                book_id: book._id,
                book_title: book.title,
                quantity,
                mode,
            },
            callback: (response: { reference: string }) => {
                setPaying(false);
                setPayModal(null);
                alert(`Payment successful! Reference: ${response.reference}`);
            },
            onClose: () => {
                setPaying(false);
            },
        });

        handler.openIframe();
    };

    const sku = book?._id ? `BK${book._id.slice(-11).toUpperCase()}` : "—";
    const isEmbargoed = book?.embargoDate && new Date(book.embargoDate) > new Date();
    const validResources = (book?.availableResources || []).filter(isValidResourceUrl);

    const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");
    const plainDesc = book ? stripHtml(book.description) : "";
    const shortDesc = plainDesc.length > 220 ? plainDesc.slice(0, 220) + "…" : plainDesc;

    const formatPrice = (price: number, currency = "USD") => {
        return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!book) return <div className="p-8">Book not found.</div>;

    return (
        <>
            <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

            {/* Lightbox */}
            {lightbox && book.image && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-zoom-out"
                    onClick={() => setLightbox(false)}
                >
                    <img src={book.image} alt={book.title} className="max-h-[90vh] max-w-[90vw] rounded shadow-2xl" />
                </div>
            )}

            {/* Payment email modal */}
            {payModal && (
                <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-1">
                            {payModal === "buy" ? "Buy Now" : "Add to Cart"}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {book.title} × {quantity} —{" "}
                            <span className="font-semibold text-gray-800">
                                {formatPrice((book.price || 0) * quantity, book.currency)}
                            </span>
                        </p>
                        <label className="block text-sm font-medium mb-1">Your email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full border rounded px-3 py-2 mb-4 text-sm"
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => initiatePaystack(payModal)}
                                disabled={paying}
                                className="flex-1 py-2 bg-[#1b2a4a] text-white rounded font-semibold text-sm hover:bg-[#243460] disabled:opacity-50"
                            >
                                {paying ? "Opening Paystack…" : "Pay with Paystack"}
                            </button>
                            <button
                                onClick={() => { setPayModal(null); setPaying(false); }}
                                className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 max-w-5xl mx-auto">
                <Link href="/dashboard/press/books" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1">
                    ← Back to Books
                </Link>

                <div className="flex flex-col md:flex-row gap-8 mt-4">
                    {/* Left — cover image */}
                    <div className="md:w-[45%] shrink-0">
                        <div className="relative border rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center min-h-85">
                            {book.image ? (
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full object-contain max-h-110"
                                />
                            ) : (
                                <div className="w-full h-64 flex items-center justify-center text-gray-300 text-6xl">📖</div>
                            )}
                            {book.image && (
                                <button
                                    onClick={() => setLightbox(true)}
                                    className="absolute bottom-3 left-3 bg-white/80 hover:bg-white border rounded p-1.5 text-gray-600 text-xs"
                                    title="Expand image"
                                >
                                    ⤢
                                </button>
                            )}
                            {isEmbargoed && (
                                <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                                    Embargoed
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right — details */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">{book.title}</h1>

                        {book.authors && book.authors.length > 0 && (
                            <p className="text-sm text-gray-500 mb-2">By {book.authors.join(", ")}</p>
                        )}

                        <p className="text-sm text-gray-400 mb-3">
                            SKU: <span className="font-mono text-gray-600">{sku}</span>
                        </p>

                        {/* Price */}
                        {book.price ? (
                            <p className="text-3xl font-bold text-gray-900 mb-4">
                                {formatPrice(book.price, book.currency)}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 italic mb-4">No price set</p>
                        )}

                        <hr className="mb-4" />

                        {/* Description */}
                        <div className="text-gray-700 text-sm leading-relaxed mb-1">
                            {expanded ? plainDesc : shortDesc}
                        </div>
                        {plainDesc.length > 220 && (
                            <div className="flex justify-between items-center mt-1 mb-4">
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {expanded ? "Read Less" : "Read More"}
                                </button>
                                <span className="text-sm text-gray-400 underline cursor-default">Delivery &amp; Returns</span>
                            </div>
                        )}

                        <hr className="my-4" />

                        {/* Embargo notice */}
                        {isEmbargoed ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                                <p className="text-orange-700 font-medium text-sm">
                                    This book is under embargo until {new Date(book.embargoDate!).toLocaleDateString()}.
                                </p>
                                <p className="text-orange-600 text-xs mt-1">Resources will become available after the embargo date.</p>
                            </div>
                        ) : book.price ? (
                            <>
                                {/* Quantity + action buttons */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center border rounded overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg leading-none"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 text-sm font-medium border-x">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(q => q + 1)}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg leading-none"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setPayModal("cart")}
                                        className="flex-1 py-3 bg-[#1b2a4a] text-white rounded font-semibold text-sm hover:bg-[#243460] transition"
                                    >
                                        Add To Cart
                                    </button>
                                    <button
                                        onClick={() => setPayModal("buy")}
                                        className="flex-1 py-3 bg-[#1b2a4a] text-white rounded font-semibold text-sm hover:bg-[#243460] transition"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </>
                        ) : validResources.length > 0 ? (
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                {validResources.map((url, i) => (
                                    <a
                                        key={i}
                                        href={getCloudinaryDownloadUrl(url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 text-center px-5 py-3 bg-[#1b2a4a] text-white rounded font-semibold text-sm hover:bg-[#243460] transition"
                                    >
                                        {i === 0 ? "Download Resource" : getResourceFilename(url)}
                                    </a>
                                ))}
                            </div>
                        ) : null}

                        <hr className="my-4" />

                        {/* Wishlist / Compare / Share row */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <button className="flex items-center gap-1 hover:text-gray-900">
                                ♡ Add To Wishlist
                            </button>
                            <button className="flex items-center gap-1 hover:text-gray-900">
                                ⇄ Compare
                            </button>
                            <div className="ml-auto flex items-center gap-2">
                                <span className="font-medium text-gray-700">Share</span>
                                <button
                                    onClick={() => {
                                        const subject = encodeURIComponent(book.title);
                                        const body = encodeURIComponent(window.location.href);
                                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                                    }}
                                    className="bg-pink-100 px-3 py-1.5 rounded text-pink-700 hover:bg-pink-200 text-xs"
                                >
                                    ✉
                                </button>
                                <button
                                    onClick={() => {
                                        const text = encodeURIComponent(`${book.title} ${window.location.href}`);
                                        window.open(`https://wa.me/?text=${text}`, "_blank");
                                    }}
                                    className="bg-pink-100 px-3 py-1.5 rounded text-pink-700 hover:bg-pink-200 text-xs"
                                >
                                    💬
                                </button>
                            </div>
                        </div>

                        <hr className="my-4" />

                        {/* People / date info */}
                        {book.datePosted && (
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 mb-4 text-sm text-gray-600">
                                <span>🕐</span>
                                <span>Published {new Date(book.datePosted).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </div>
                        )}

                        {/* Payment methods */}
                        {book.price && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-400 mb-2">Payment Methods</p>
                                <div className="flex items-center gap-3">
                                    <span className="border rounded px-2 py-1 text-xs font-bold text-blue-800 tracking-widest">VISA</span>
                                    <span className="border rounded px-2 py-1 text-xs font-bold text-red-600">MC</span>
                                    <span className="border rounded px-2 py-1 text-xs font-bold text-green-700">M-PESA</span>
                                    <span className="border rounded px-2 py-1 text-xs font-bold text-blue-500">Paystack</span>
                                </div>
                            </div>
                        )}

                        {/* Admin actions */}
                        <div className="flex gap-3 mt-6 pt-4 border-t">
                            <Link
                                href={`/dashboard/press/books/${id}/edit`}
                                className="px-5 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm font-medium"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
