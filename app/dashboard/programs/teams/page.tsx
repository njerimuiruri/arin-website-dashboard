"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTeamMembers, deleteTeamMember } from "@/services/teamsService";

type TeamMember = {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    bio?: string;
    image?: string;
};

export default function TeamsPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    const truncateBio = (bio: string, sentences: number = 10) => {
        if (!bio) return "";
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const matches = bio.match(sentenceRegex);
        if (!matches) return bio.substring(0, 150) + "...";
        const truncated = matches.slice(0, sentences).join(" ");
        return matches.length > sentences ? truncated + "..." : truncated;
    };

    const loadMembers = async () => {
        try {
            setLoading(true);
            const data = await getTeamMembers();
            setMembers(data);
        } catch (e: any) {
            setError(e.message || "Failed to load team members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadMembers(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this team member?")) return;
        try {
            await deleteTeamMember(id);
            await loadMembers();
        } catch (e: any) {
            alert(e.message || "Delete failed");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Teams</h1>
                <Link href="/dashboard/programs/teams/create" className="px-4 py-2 bg-blue-600 text-white rounded">Create Team Member</Link>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map(m => (
                    <div key={m._id} className="border rounded-lg p-4 bg-white shadow-sm">
                        {/* Image at top */}
                        <div className="w-full mb-4">
                            <img
                                src={m.image ? `http://localhost:5001${m.image}` : "/placeholder.png"}
                                alt={`${m.firstName} ${m.lastName}`}
                                className="w-full h-48 object-cover rounded-lg bg-gray-100"
                            />
                        </div>

                        {/* Name and Role */}
                        <div className="mb-3">
                            <h3 className="font-semibold text-lg">{m.firstName} {m.lastName}</h3>
                            <p className="text-sm text-gray-600">{m.role}</p>
                        </div>

                        {/* Truncated Bio */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-700 line-clamp-3">
                                {truncateBio(m.bio || "No bio available", 2)}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setSelectedMember(m)}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                View More
                            </button>
                            <Link
                                href={`/dashboard/programs/teams/${m._id}/edit`}
                                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(m._id)}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Enhanced Modal */}
            {selectedMember !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-semibold">Team Member Details</h2>
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Image */}
                            <div className="mb-6">
                                <img
                                    src={selectedMember.image ? `http://localhost:5001${selectedMember.image}` : "/placeholder.png"}
                                    alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>

                            {/* Name and Role */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">
                                    {selectedMember.firstName} {selectedMember.lastName}
                                </h3>
                                <p className="text-lg text-blue-600 font-medium">{selectedMember.role}</p>
                            </div>

                            {/* Full Bio */}
                            <div className="mb-4">
                                <h4 className="font-semibold text-lg mb-2">Biography</h4>
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {selectedMember.bio || "No bio available"}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 sticky bottom-0">
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
