"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Calendar, FolderOpen, Tag, Clock, FileText, Users, TrendingUp, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HtmlRenderer from '@/components/HtmlRenderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getResearchProject, deleteResearchProject } from '@/services/researchProjectService';

export default function ViewProjectDetailsPage() {
    const params = useParams();
    const id = typeof params === 'object' && params !== null ? params.id : params;
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function fetchProject() {
            setLoading(true);
            setError("");
            try {
                if (!id || id === 'undefined' || id === undefined) {
                    throw new Error("Invalid or missing project ID in URL.");
                }
                const data = await getResearchProject(id.toString());
                setProject(data);
            } catch (err) {
                setError(err.message || "Failed to load project");
            } finally {
                setLoading(false);
            }
        }
        if (id && id !== 'undefined') fetchProject();
        else setError("Invalid or missing project ID in URL.");
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
        setDeleting(true);
        try {
            await deleteResearchProject(id);
            router.push("/dashboard/programs/research-projects");
        } catch (err) {
            setError(err.message || "Failed to delete project");
        } finally {
            setDeleting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Ongoing': return 'bg-green-100 text-green-800 border-green-300';
            case 'Completed': return 'bg-slate-100 text-slate-800 border-slate-300';
            case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default: return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    const renderDescription = (description) => {
        if (!description) return <p className="text-slate-500">No description available.</p>;

        // If it's a string
        if (typeof description === 'string') {
            // Try to parse as JSON (legacy Slate format)
            try {
                const parsed = JSON.parse(description);
                if (Array.isArray(parsed)) {
                    // Convert Slate JSON to plain text for display
                    const text = parsed
                        .map(n => n.children?.map?.(c => c.text).join('') || '')
                        .join('\n');
                    return <p className="whitespace-pre-wrap">{text}</p>;
                }
            } catch (e) {
                // Not valid JSON, continue
            }

            // Use HtmlRenderer for HTML content (TipTap format)
            return <HtmlRenderer content={description} className="mt-4" />;
        }

        // If it's already an array (legacy Slate format)
        if (Array.isArray(description)) {
            const text = description
                .map(n => n.children?.map?.(c => c.text).join('') || '')
                .join('\n');
            return <p className="whitespace-pre-wrap">{text}</p>;
        }

        return <p className="text-slate-500">Invalid description format.</p>;
    };

    if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!project) return <div className="p-8 text-center">Project not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                                {project.status && (
                                    <Badge className={`${getStatusColor(project.status)} border`}>
                                        {project.status}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-slate-600 mt-1 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {project.date}
                                {project.category && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <FolderOpen className="h-4 w-4" />
                                        {project.category}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/dashboard/programs/research-projects/${id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Project
                        </Button>
                        <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <CardTitle>Project Overview</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-slate-700 leading-relaxed prose max-w-none">
                                    {renderDescription(project.description)}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-5 w-5 text-blue-600" />
                                        <CardTitle>Research Tags</CardTitle>
                                    </div>
                                    <CardDescription>Key topics and themes covered in this project</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-sm py-1.5 px-3">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Collaborators */}
                        {project.collaborators && Array.isArray(project.collaborators) && project.collaborators.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                        <CardTitle>Collaborating Organizations</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {project.collaborators.map((collab, index) => (
                                            <li key={index} className="flex items-center gap-2 text-slate-700">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                {collab}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        {(project.duration || project.budget || project.fundingSource) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Project Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {project.duration && (
                                        <>
                                            <div>
                                                <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Duration
                                                </div>
                                                <div className="text-sm font-semibold text-slate-900">{project.duration}</div>
                                            </div>
                                            <Separator />
                                        </>
                                    )}
                                    {project.budget && (
                                        <>
                                            <div>
                                                <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" />
                                                    Budget
                                                </div>
                                                <div className="text-sm font-semibold text-slate-900">{project.budget}</div>
                                            </div>
                                            <Separator />
                                        </>
                                    )}
                                    {project.fundingSource && (
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 mb-1">Funding Source</div>
                                            <div className="text-sm font-semibold text-slate-900">{project.fundingSource}</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Team Members */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Team Members</CardTitle>
                                <CardDescription>Lead researchers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Array.isArray(project.projectTeam) && project.projectTeam.length > 0 ? (
                                        project.projectTeam.map((member: any, index: number) => (
                                            <div key={member._id || member.id || index} className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                                                    {typeof member === 'string'
                                                        ? member.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
                                                        : (member.name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900">
                                                        {typeof member === 'string' ? member : member.name || 'Unnamed'}
                                                    </div>
                                                    <div className="text-xs text-slate-500">Researcher</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-slate-500 text-sm">No team members listed.</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        {(project.createdDate || project.lastUpdated) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {project.createdDate && (
                                        <>
                                            <div>
                                                <div className="text-xs font-medium text-slate-500 mb-1">Created</div>
                                                <div className="text-sm text-slate-900">{project.createdDate}</div>
                                            </div>
                                            <Separator />
                                        </>
                                    )}
                                    {project.lastUpdated && (
                                        <div>
                                            <div className="text-xs font-medium text-slate-500 mb-1">Last Updated</div>
                                            <div className="text-sm text-slate-900">{project.lastUpdated}</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/dashboard/programs/research-projects/${id}/edit`)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Project
                                </Button>
                                <Button variant="destructive" className="w-full" disabled={deleting} onClick={handleDelete}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {deleting ? "Deleting..." : "Delete"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}