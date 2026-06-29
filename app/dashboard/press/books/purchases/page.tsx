"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { purchasesService, Purchase } from "@/services/purchasesService";

export default function BookPurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        purchasesService.getAll()
            .then(data => { setPurchases(data); setError(null); })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = purchases.filter(p =>
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
        p.reference.toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = purchases
        .filter(p => p.status === "success")
        .reduce((sum, p) => sum + p.amount / 100, 0);

    const formatAmount = (amount: number, currency: string) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);

    if (loading) return <div className="p-8 text-gray-500">Loading purchases...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Book Purchases</h1>
                    <p className="text-sm text-gray-500 mt-1">All completed book sales and email delivery status</p>
                </div>
                <Link href="/dashboard/press/books" className="text-sm text-blue-600 hover:underline">
                    ← Back to Books
                </Link>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
                    <p className="text-3xl font-bold text-gray-900">{purchases.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Emails Sent</p>
                    <p className="text-3xl font-bold text-emerald-600">
                        {purchases.filter(p => p.emailSent).length}
                        <span className="text-base font-normal text-gray-400 ml-1">/ {purchases.length}</span>
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-[#021d49]">
                        {purchases.length > 0
                            ? new Intl.NumberFormat("en-US", { style: "currency", currency: purchases[0]?.currency || "USD" }).format(totalRevenue)
                            : "$0.00"}
                    </p>
                </div>
            </div>

            {/* Search */}
            <input
                className="w-full mb-4 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Search by email, book title or reference..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    {purchases.length === 0 ? "No purchases yet." : "No results match your search."}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Buyer Email</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Book</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Sent</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(p => (
                                    <tr key={p._id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {new Date(p.createdAt).toLocaleDateString("en-GB", {
                                                day: "numeric", month: "short", year: "numeric"
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-gray-800 font-medium">{p.email}</td>
                                        <td className="px-4 py-3 text-gray-700 max-w-xs">
                                            <span className="line-clamp-1">{p.bookTitle}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                                            {formatAmount(p.amount, p.currency)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {p.emailSent ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                    ✓ Sent
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                                    ✗ Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                                                {p.reference}
                                            </code>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
