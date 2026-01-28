
"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { callForBooksService } from "@/services/callForBooksService";
import HtmlRenderer from "@/components/HtmlRenderer";

export default async function CallViewPage({ params }) {
    const { id } = params;
    if (!id || id === "undefined") {
        return <div className="p-8 text-red-600">Error: Invalid or missing ID.</div>;
    }
    let item = null;
    let error = null;
    try {
        item = await callForBooksService.getById(id);
    } catch (err) {
        error = err?.message || "Failed to fetch data.";
    }
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!item) return <div className="p-8">Call for Book Chapter not found.</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            {item.image && <img src={item.image} alt={item.title} className="w-full h-64 object-cover rounded mb-4" />}
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">{new Date(item.deadline) > new Date() ? "Open" : "Closed"}</span>
                <span className="text-xs text-gray-500">Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString() : "-"}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
            <HtmlRenderer content={item.description} className="mb-4" />
            {item.availableResources && item.availableResources.length > 0 && (
                <div className="mb-4">
                    <h2 className="font-semibold mb-1">Available Resources:</h2>
                    <ul className="list-disc list-inside">
                        {item.availableResources.map((url, idx) => (
                            <li key={idx}>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Resource {idx + 1}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <Link href="/dashboard/press/call-for-chapters" className="text-blue-600 underline">Back to Calls</Link>
        </div>
    );
}
