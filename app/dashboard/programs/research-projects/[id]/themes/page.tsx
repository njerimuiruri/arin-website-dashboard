"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { ArrowLeft, BookOpen, Layers, Paperclip } from "lucide-react";
import { getThemesByProject, deleteTheme, reorderThemes } from "@/services/themeService";
import { getResearchProject } from "@/services/researchProjectService";

type Theme = {
    _id: string;
    name: string;
    overview?: string;
    coverImage?: string;
    learningModules?: any[];
    resources?: any[];
    order?: number;
};

const imgSrc = (image?: string) =>
    image
        ? image.startsWith("http")
            ? image
            : `https://api.demo.arin-africa.org${image}`
        : "/placeholder.png";

function SortableCard({
    theme,
    projectId,
    onDelete,
}: {
    theme: Theme;
    projectId: string;
    onDelete: (id: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: theme._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="border rounded-lg p-4 bg-white shadow-sm">
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

            <div className="w-full mb-4">
                <img
                    src={imgSrc(theme.coverImage)}
                    alt={theme.name}
                    className="w-full h-40 object-cover rounded-lg bg-gray-100"
                    onError={e => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                />
            </div>

            <div className="mb-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-600 shrink-0" /> {theme.name}
                </h3>
                {theme.overview && <p className="text-sm text-gray-600 line-clamp-2 mt-1">{theme.overview}</p>}
            </div>

            <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {theme.learningModules?.length || 0} module{(theme.learningModules?.length || 0) === 1 ? '' : 's'}</span>
                <span className="flex items-center gap-1"><Paperclip className="h-3.5 w-3.5" /> {theme.resources?.length || 0} resource{(theme.resources?.length || 0) === 1 ? '' : 's'}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
                <Link
                    href={`/dashboard/programs/research-projects/${projectId}/themes/${theme._id}/edit`}
                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                >
                    Edit
                </Link>
                <button
                    onClick={() => onDelete(theme._id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default function ProjectThemesPage() {
    const params = useParams();
    const projectId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

    const [projectTitle, setProjectTitle] = useState('');
    const [themes, setThemes] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const loadThemes = useCallback(async () => {
        if (!projectId) return;
        try {
            setLoading(true);
            const data = await getThemesByProject(projectId);
            setThemes(data);
        } catch (e: any) {
            setError(e.message || "Failed to load themes");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => { loadThemes(); }, [loadThemes]);

    useEffect(() => {
        if (!projectId) return;
        getResearchProject(projectId).then(p => setProjectTitle(p.title || '')).catch(() => {});
    }, [projectId]);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this project area? Its learning modules and resources will be removed too.")) return;
        try {
            await deleteTheme(id);
            await loadThemes();
        } catch (e: any) {
            alert(e.message || "Delete failed");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = themes.findIndex(t => t._id === active.id);
        const newIndex = themes.findIndex(t => t._id === over.id);
        const reordered = arrayMove(themes, oldIndex, newIndex);
        setThemes(reordered);

        try {
            setSaving(true);
            await reorderThemes(projectId, reordered.map(t => t._id));
        } catch (e: any) {
            alert("Failed to save order: " + e.message);
            await loadThemes();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href={`/dashboard/programs/research-projects/${projectId}/edit`}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to {projectTitle || 'Project'}
                    </Link>
                    <h1 className="text-2xl font-semibold">Project Areas</h1>
                    <p className="text-sm text-gray-500 mt-1">Drag cards to reorder — order reflects on the website</p>
                </div>
                <div className="flex items-center gap-3">
                    {saving && <span className="text-sm text-blue-600">Saving order…</span>}
                    <Link
                        href={`/dashboard/programs/research-projects/${projectId}/themes/new`}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Create Project Area
                    </Link>
                </div>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {!loading && !error && themes.length === 0 && (
                <div className="text-sm text-gray-500 p-6 bg-gray-50 rounded-lg border border-dashed">
                    No project areas yet. Create one to give it its own page — overview, learning modules, and resources.
                </div>
            )}

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={themes.map(t => t._id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {themes.map(theme => (
                            <SortableCard
                                key={theme._id}
                                theme={theme}
                                projectId={projectId}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
