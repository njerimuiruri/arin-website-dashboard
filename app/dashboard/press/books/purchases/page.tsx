"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { purchasesService, Purchase } from "@/services/purchasesService";

export default function BookPurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [resendingId, setResendingId] = useState<string | null>(null);
    const [syncing, setSyncing] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    const load = () =>
        purchasesService.getAll()
            .then(data => { setPurchases(data); setError(null); })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));

    useEffect(() => { load(); }, []);

    const handleResend = async (p: Purchase) => {
        setResendingId(p._id);
        setNotice(null);
        try {
            const updated = await purchasesService.resendEmail(p._id);
            setPurchases(prev => prev.map(x => (x._id === updated._id ? updated : x)));
            setNotice(updated.emailSent
                ? `Email sent to ${updated.email}`
                : `Email to ${updated.email} failed: ${updated.emailError || "unknown error"}`);
        } catch (err) {
            setNotice(err instanceof Error ? err.message : "Failed to resend email");
        } finally {
            setResendingId(null);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        setNotice(null);
        try {
            const { checked, added } = await purchasesService.syncFromPaystack();
            setNotice(`Checked ${checked} Paystack book payments — ${added} missing purchase${added === 1 ? "" : "s"} added.${added > 0 ? " Use “Resend” to email them their book." : ""}`);
            await load();
        } catch (err) {
            setNotice(err instanceof Error ? err.message : "Failed to sync with Paystack");
        } finally {
            setSyncing(false);
        }
    };

    const filtered = purchases.filter(p =>
        (p.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
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
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="px-4 py-2 text-sm font-semibold bg-[#021d49] text-white rounded-lg hover:bg-[#032a5e] disabled:opacity-50 transition"
                    >
                        {syncing ? "Syncing…" : "Sync from Paystack"}
                    </button>
                    <Link href="/dashboard/press/books" className="text-sm text-blue-600 hover:underline">
                        ← Back to Books
                    </Link>
                </div>
            </div>

            {notice && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800 flex justify-between items-start gap-4">
                    <span>{notice}</span>
                    <button onClick={() => setNotice(null)} className="text-blue-400 hover:text-blue-600">✕</button>
                </div>
            )}

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
                placeholder="Search by name, email, book title or reference..."
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
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Buyer</th>
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
                                        <td className="px-4 py-3">
                                            <div className="text-gray-900 font-medium">
                                                {p.name || <span className="text-gray-400 italic font-normal">Name not provided</span>}
                                            </div>
                                            <div className="text-gray-500 text-xs break-all">{p.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700 max-w-xs">
                                            <span className="line-clamp-1">{p.bookTitle}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                                            {formatAmount(p.amount, p.currency)}
                                        </td>
                                        <td className="px-4 py-3 text-center whitespace-nowrap">
                                            {p.emailSent ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                    ✓ Sent
                                                </span>
                                            ) : (
                                                <span
                                                    title={p.emailError || "Not sent yet"}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold"
                                                >
                                                    ✗ Not sent
                                                </span>
                                            )}
                                            <button
                                                onClick={() => handleResend(p)}
                                                disabled={resendingId === p._id}
                                                className="ml-2 text-xs text-blue-600 hover:underline disabled:opacity-50"
                                            >
                                                {resendingId === p._id ? "Sending…" : "Resend"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono whitespace-nowrap">
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
