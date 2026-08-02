"use client";
import { useEffect, useState } from "react";
// ...existing code...
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save, FileText, Calendar, FolderOpen, Info, X, Upload, ImagePlus, Target, Layers, Paperclip, Images, Link2, Sparkles, Flag, TrendingUp, Landmark } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getResearchProject, updateResearchProject } from '@/services/researchProjectService';
import TagListEditor from '@/components/research-projects/TagListEditor';
import ResourcesManager, { ResourceItem } from '@/components/research-projects/ResourcesManager';
import GalleryManager, { GalleryItem } from '@/components/research-projects/GalleryManager';
import RelatedInitiativesManager, { RelatedInitiative } from '@/components/research-projects/RelatedInitiativesManager';
import AbstractsManager, { AbstractItem } from '@/components/research-projects/AbstractsManager';
import ThemesManager, { ThemeItem } from '@/components/research-projects/ThemesManager';
import OrgLogosManager, { OrgItem } from '@/components/research-projects/OrgLogosManager';

export default function EditProjectPage() {
    const params = useParams();
    const id = typeof params === 'object' && params !== null ? params.id : params;
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        date: "",
        category: "",
        description: "",
        projectTeam: [] as string[],
        teamMembers: [] as any[],
        coverImage: "",
    });
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [coverImage, setCoverImage] = useState("");
    const [objectives, setObjectives] = useState<string[]>([]);
    const [focusAreas, setFocusAreas] = useState<string[]>([]);
    const [goal, setGoal] = useState('');
    const [outputs, setOutputs] = useState('');
    const [longTermOutcome, setLongTermOutcome] = useState('');
    const [intermediateOutcomes, setIntermediateOutcomes] = useState<string[]>([]);
    const [funders, setFunders] = useState<OrgItem[]>([]);
    const [partners, setPartners] = useState<OrgItem[]>([]);
    const [themes, setThemes] = useState<ThemeItem[]>([]);
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [relatedInitiatives, setRelatedInitiatives] = useState<RelatedInitiative[]>([]);
    const [abstracts, setAbstracts] = useState<AbstractItem[]>([]);
    const themeNames = themes.map((t) => t.name);

    useEffect(() => {
        async function fetchProject() {
            setLoading(true);
            setError("");
            try {
                if (!id || typeof id !== 'string') throw new Error('Invalid project ID');
                const data = await getResearchProject(id);
                // For TipTap, we expect HTML strings
                // If backend stores Slate JSON, we need to convert it
                let htmlDescription = '';
                if (data.description) {
                    // If description is HTML, use as is
                    htmlDescription = data.description;
                    // If description is Slate JSON, convert to HTML here (not implemented)
                }
                const projectData = {
                    title: data.title || "",
                    date: data.date || "",
                    category: data.category || "",
                    description: htmlDescription,
                    projectTeam: Array.isArray(data.projectTeam) ? data.projectTeam : [],
                    teamMembers: data.teamMembers || [],
                    coverImage: data.coverImage || ""
                };
                setForm(projectData);
                setEditorContent(htmlDescription);
                setTeamMembers(data.teamMembers || []);
                setCoverImage(data.coverImage || "");
                setObjectives(Array.isArray(data.objectives) ? data.objectives : []);
                setFocusAreas(Array.isArray(data.focusAreas) ? data.focusAreas : []);
                setGoal(data.goal || '');
                setOutputs(typeof data.outputs === 'string' ? data.outputs : '');
                setLongTermOutcome(data.longTermOutcome || '');
                setIntermediateOutcomes(Array.isArray(data.intermediateOutcomes) ? data.intermediateOutcomes : []);
                setFunders(Array.isArray(data.funders) ? data.funders : []);
                setPartners(Array.isArray(data.partners) ? data.partners : []);
                setThemes(Array.isArray(data.themes) ? data.themes : []);
                setResources(Array.isArray(data.resources) ? data.resources : []);
                setGallery(Array.isArray(data.gallery) ? data.gallery : []);
                setRelatedInitiatives(Array.isArray(data.relatedInitiatives) ? data.relatedInitiatives : []);
                setAbstracts(Array.isArray(data.abstracts) ? data.abstracts : []);
            } catch (err) {
                console.error('Error fetching project:', err);
                if (err instanceof Error) {
                    setError(err.message || "Failed to load project");
                } else {
                    setError("Failed to load project");
                }
            } finally {
                setLoading(false);
            }
        }
        if (id && typeof id === 'string') fetchProject();
    }, [id]);

    async function handleUpdate(updates: Record<string, any>) {
        const res = await fetch(`/api/research-projects/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        const updated = await res.json();
        setForm(prev => ({ ...prev, ...updated }));
        setTeamMembers(updated.teamMembers || []);
        setCoverImage(updated.coverImage || "");
        if (updated.description) {
            setEditorContent(updated.description);
        }
    }


    const [authorInput, setAuthorInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddAuthor = () => {
        if (authorInput.trim() && !form.projectTeam.includes(authorInput.trim())) {
            setForm({ ...form, projectTeam: [...form.projectTeam, authorInput.trim()] });
            setAuthorInput("");
        }
    };

    const handleRemoveAuthor = (author: string) => {
        setForm({ ...form, projectTeam: form.projectTeam.filter(a => a !== author) });
    };

    const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageUploading(true);
        setError("");
        try {
            // Use the correct upload endpoint from the service
            const formData = new FormData();
            formData.append('coverImage', file);
            const res = await fetch('https://api.demo.arin-africa.org/api/research-projects/upload-cover-image', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const data = await res.json();
            if (!data.url) throw new Error('Image upload failed');
            setForm(prev => ({ ...prev, coverImage: data.url }));
            setCoverImage(data.url);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Image upload failed');
            } else {
                setError('Image upload failed');
            }
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError("");
        try {
            if (!id || typeof id !== 'string') throw new Error('Invalid project ID');
            await updateResearchProject(id, {
                ...form,
                teamMembers: form.projectTeam,
                coverImage,
                objectives,
                focusAreas,
                goal,
                outputs,
                longTermOutcome,
                intermediateOutcomes,
                funders,
                partners,
                themes,
                resources,
                gallery,
                relatedInitiatives,
                abstracts,
            });
            alert('Project updated successfully!');
            router.push('/dashboard/programs/research-projects');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to update project');
            } else {
                setError('Failed to update project');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading project...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 animate-in slide-in-from-left duration-500">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-white/60 transition-all"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Edit Project
                        </h1>
                        <p className="text-slate-600 mt-1">Update your research project entry</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 animate-in slide-in-from-top">
                        <X className="h-5 w-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Basic Information */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Basic Information</CardTitle>
                                <CardDescription>Edit the core details of your research project</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                                Project Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g., State of Adaptation Report, 2025"
                                className="text-lg h-12 border-2 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    Project Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="h-12 border-2 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-base font-semibold flex items-center gap-2">
                                    <FolderOpen className="h-4 w-4 text-blue-600" />
                                    Category (optional)
                                </Label>
                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange as any}
                                    className="h-12 border-2 focus:border-blue-500 transition-all rounded-md px-3"
                                >
                                    <option value="">No category</option>
                                    {['Finance', 'Environment', 'Health', 'Sustainability', 'Energy', 'Water', 'Agriculture'].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Project Image Upload */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-600 rounded-lg">
                                <ImagePlus className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Project Image</CardTitle>
                                <CardDescription>Upload or update the main project image</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="project-image" className="text-base font-semibold flex items-center gap-2">
                                Upload Image
                            </Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="project-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProjectImageUpload}
                                    disabled={imageUploading}
                                    className="h-12 border-2 focus:border-purple-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                {imageUploading && (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                                )}
                            </div>
                            {form.coverImage && (
                                <div className="mt-4 relative w-full max-w-md">
                                    <img
                                        src={coverImage || form.coverImage}
                                        alt="Project preview"
                                        className="w-full h-auto rounded-lg border-2 border-purple-200 shadow-md"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            setForm(prev => ({ ...prev, coverImage: '' }));
                                            setCoverImage("");
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>


                {/* Rich Text Description (Slate) */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-indigo-50 to-purple-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <Info className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Project Description</CardTitle>
                                <CardDescription>Edit detailed information with formatting</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <ImprovedTiptapEditor
                            value={editorContent}
                            onChange={(html) => {
                                setEditorContent(html);
                                setForm(prev => ({ ...prev, description: html }));
                            }}
                            placeholder="Edit detailed project description with images, formatting, and links..."
                            uploadUrl="https://api.demo.arin-africa.org/api/research-projects/upload-description-image"
                            uploadFieldName="image"
                        />
                        <p className="text-xs text-slate-500">
                            {editorContent.replace(/<[^>]*>/g, '').length} characters
                        </p>
                    </CardContent>
                </Card>

                {/* Project Goal */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-rose-50 to-orange-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-600 rounded-lg">
                                <Flag className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Project Goal</CardTitle>
                                <CardDescription>Shown as its own highlighted section, right after the description</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g. To build a cadre of mathematical AI skills in academia and policy spaces..."
                            className="border-2 focus:border-rose-500 min-h-24"
                        />
                    </CardContent>
                </Card>

                {/* Objectives & Focus Areas */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-sky-50 to-blue-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-600 rounded-lg">
                                <Target className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Objectives & Focus Areas</CardTitle>
                                <CardDescription>Bullet points shown in the "About the Project" section</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Objectives</Label>
                            <TagListEditor items={objectives} onChange={setObjectives} placeholder="Type an objective and press Enter" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <Layers className="h-4 w-4 text-sky-600" /> Key Focus Areas
                            </Label>
                            <TagListEditor items={focusAreas} onChange={setFocusAreas} placeholder="Type a focus area and press Enter" />
                        </div>
                    </CardContent>
                </Card>

                {/* Outcomes */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-emerald-50 to-lime-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-600 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Outputs & Outcomes</CardTitle>
                                <CardDescription>Shown as their own section, right after Objectives</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Outputs</Label>
                            <div className="border-2 rounded-md overflow-hidden focus-within:border-emerald-500">
                                <ImprovedTiptapEditor
                                    value={outputs}
                                    onChange={setOutputs}
                                    placeholder="e.g. Evidence Synthesis Report: A comprehensive review of existing capacity-building initiatives..."
                                    uploadUrl="https://api.demo.arin-africa.org/api/research-projects/upload-description-image"
                                    uploadFieldName="image"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Long-term Outcome</Label>
                            <Textarea
                                value={longTermOutcome}
                                onChange={(e) => setLongTermOutcome(e.target.value)}
                                placeholder="e.g. Strengthened skill sets and decision-support systems for..."
                                className="border-2 focus:border-emerald-500 min-h-20"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Intermediate Outcomes</Label>
                            <TagListEditor items={intermediateOutcomes} onChange={setIntermediateOutcomes} placeholder="Type an intermediate outcome and press Enter" />
                        </div>
                    </CardContent>
                </Card>

                {/* Funders & Partners */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-teal-50 to-cyan-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-600 rounded-lg">
                                <Landmark className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Funders & Partners</CardTitle>
                                <CardDescription>Shown with logos in their own section on the project page</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Funder(s)</Label>
                            <OrgLogosManager items={funders} onChange={setFunders} namePlaceholder="Funder name, e.g. International Development Research Centre (Canada)" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Partners</Label>
                            <OrgLogosManager items={partners} onChange={setPartners} namePlaceholder="Partner organisation name" />
                        </div>
                    </CardContent>
                </Card>

                {/* Themes */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-amber-50 to-yellow-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-600 rounded-lg">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Themes</CardTitle>
                                <CardDescription>Named sub-topics (e.g. "AI for Climate Resilience") that group Resources and Abstracts onto their own tab</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ThemesManager items={themes} onChange={setThemes} />
                    </CardContent>
                </Card>

                {/* Resources */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Paperclip className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Resources & Presentations</CardTitle>
                                <CardDescription>PDFs, reports, presentations, toolkits and other downloadable files</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ResourcesManager items={resources} onChange={setResources} themes={themeNames} />
                    </CardContent>
                </Card>

                {/* Gallery */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-purple-50 to-fuchsia-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-600 rounded-lg">
                                <Images className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Gallery</CardTitle>
                                <CardDescription>Optional photos shown in a gallery on the project page</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <GalleryManager items={gallery} onChange={setGallery} />
                    </CardContent>
                </Card>

                {/* Abstracts */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-indigo-50 to-violet-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Abstracts</CardTitle>
                                <CardDescription>Optional student/researcher abstract submissions shown as cards on the project page</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <AbstractsManager items={abstracts} onChange={setAbstracts} themes={themeNames} />
                    </CardContent>
                </Card>

                {/* Related Initiatives */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-600 rounded-lg">
                                <Link2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Related Initiatives</CardTitle>
                                <CardDescription>Link out to associated programmes, e.g. ARIN Publishing Academy</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <RelatedInitiativesManager items={relatedInitiatives} onChange={setRelatedInitiatives} />
                    </CardContent>
                </Card>

                {/* Project Team */}
                <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-linear-to-r from-emerald-50 to-teal-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-600 rounded-lg">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Project Team</CardTitle>
                                <CardDescription>Edit team members for this project</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-3">
                            <Label htmlFor="projectTeam" className="text-base font-semibold">
                                Team Members <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="projectTeam"
                                    value={authorInput}
                                    onChange={e => setAuthorInput(e.target.value)}
                                    placeholder="Enter name or email"
                                    className="h-12 border-2 focus:border-emerald-500 transition-all"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddAuthor();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddAuthor}
                                    className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6"
                                >
                                    Add
                                </Button>
                            </div>
                            {form.projectTeam.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-100">
                                    {form.projectTeam.map((author, idx) => (
                                        <Badge
                                            key={idx}
                                            className="px-3 py-2 bg-white border-2 border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all text-sm"
                                        >
                                            {author}
                                            <button
                                                type="button"
                                                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                onClick={() => handleRemoveAuthor(author)}
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Remove duplicate preview blocks. Team and image are handled above. */}
                <Card className="border-2 shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                className="sm:w-auto w-full h-12 border-2"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="sm:w-auto w-full h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                                disabled={saving}
                            >
                                <Save className="mr-2 h-5 w-5" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}