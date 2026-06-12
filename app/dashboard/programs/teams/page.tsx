"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getTeamMembers, deleteTeamMember, reorderTeamMembers } from "@/services/teamsService";

type TeamMember = {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
    bio?: string;
    image?: string;
    order?: number;
};

const imgSrc = (image?: string) =>
    image
        ? image.startsWith("http")
            ? image
            : `https://api.demo.arin-africa.org${image}`
        : "/placeholder.png";

function SortableCard({
    m,
    onView,
    onDelete,
}: {
    m: TeamMember;
    onView: (m: TeamMember) => void;
    onDelete: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: m._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const truncateBio = (bio: string, sentences: number = 2) => {
        if (!bio) return "";
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const matches = bio.match(sentenceRegex);
        if (!matches) return bio.substring(0, 150) + "...";
        const truncated = matches.slice(0, sentences).join(" ");
        return matches.length > sentences ? truncated + "..." : truncated;
    };

    return (
        <div ref={setNodeRef} style={style} className="border rounded-lg p-4 bg-white shadow-sm">
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="flex items-center gap-1 mb-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 select-none"
                title="Drag to reorder"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="4" r="1.2" />
                    <circle cx="11" cy="4" r="1.2" />
                    <circle cx="5" cy="8" r="1.2" />
                    <circle cx="11" cy="8" r="1.2" />
                    <circle cx="5" cy="12" r="1.2" />
                    <circle cx="11" cy="12" r="1.2" />
                </svg>
                <span className="text-xs">drag to reorder</span>
            </div>

            {/* Image */}
            <div className="w-full mb-4">
                <img
                    src={imgSrc(m.image)}
                    alt={`${m.firstName} ${m.lastName}`}
                    className="w-full h-48 object-cover rounded-lg bg-gray-100"
                    onError={e => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                />
            </div>

            {/* Name and Role */}
            <div className="mb-3">
                <h3 className="font-semibold text-lg">{m.firstName} {m.lastName}</h3>
                <p className="text-sm text-gray-600">{m.role}</p>
            </div>

            {/* Truncated Bio */}
            <div className="mb-4">
                <div
                    className="text-sm text-gray-700 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: truncateBio(m.bio || "No bio available", 2) }}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => onView(m)}
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
                    onClick={() => onDelete(m._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default function TeamsPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const loadMembers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getTeamMembers();
            setMembers(data);
        } catch (e: any) {
            setError(e.message || "Failed to load team members");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadMembers(); }, [loadMembers]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this team member?")) return;
        try {
            await deleteTeamMember(id);
            await loadMembers();
        } catch (e: any) {
            alert(e.message || "Delete failed");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = members.findIndex(m => m._id === active.id);
        const newIndex = members.findIndex(m => m._id === over.id);
        const reordered = arrayMove(members, oldIndex, newIndex);
        setMembers(reordered);

        try {
            setSaving(true);
            await reorderTeamMembers(reordered.map(m => m._id));
        } catch (e: any) {
            alert("Failed to save order: " + e.message);
            await loadMembers();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Teams</h1>
                    <p className="text-sm text-gray-500 mt-1">Drag cards to reorder — order reflects on the website</p>
                </div>
                <div className="flex items-center gap-3">
                    {saving && <span className="text-sm text-blue-600">Saving order…</span>}
                    <Link href="/dashboard/programs/teams/create" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Create Team Member
                    </Link>
                </div>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={members.map(m => m._id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map(m => (
                            <SortableCard
                                key={m._id}
                                m={m}
                                onView={setSelectedMember}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Modal */}
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
                            <div className="mb-6">
                                <img
                                    src={imgSrc(selectedMember.image)}
                                    alt={`${selectedMember.firstName} ${selectedMember.lastName}`}
                                    className="w-full h-64 object-cover rounded-lg"
                                    onError={e => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                                />
                            </div>

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">
                                    {selectedMember.firstName} {selectedMember.lastName}
                                </h3>
                                <p className="text-lg text-blue-600 font-medium">{selectedMember.role}</p>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-semibold text-lg mb-2">Biography</h4>
                                <div
                                    className="text-gray-700 whitespace-pre-line leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selectedMember.bio || "No bio available" }}
                                />
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
