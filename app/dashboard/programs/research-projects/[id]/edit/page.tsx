"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save, FileText, Calendar, FolderOpen, Info, X, Upload } from "lucide-react";
import { Input } from '@/components/ui/input';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getResearchProject, updateResearchProject } from '@/services/researchProjectService';

export default function EditProjectPage() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        date: "",
        category: "",
        description: "",
        projectTeam: [],
        image: ""
    });
    const [authorInput, setAuthorInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    // TipTap uses HTML strings, not Slate objects
    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        async function fetchProject() {
            setLoading(true);
            setError("");
            try {
                const data = await getResearchProject(id);

                // For TipTap, we expect HTML strings
                // If backend stores Slate JSON, we need to convert it
                let htmlDescription = '';
                if (data.description) {
                    if (typeof data.description === 'string') {
                        // Could be HTML or JSON string
                        if (data.description.startsWith('[') || data.description.startsWith('{')) {
                            // Likely Slate JSON - convert to plain text for now
                            try {
                                const parsed = JSON.parse(data.description);
                                if (Array.isArray(parsed)) {
                                    htmlDescription = parsed
                                        .map(n => n.children?.map?.(c => c.text).join('') || '')
                                        .join('<br>');
                                }
                            } catch {
                                htmlDescription = data.description;
                            }
                        } else {
                            // Already HTML or plain text
                            htmlDescription = data.description;
                        }
                    }
                }

                const projectData = {
                    title: data.title || "",
                    date: data.date || "",
                    category: data.category || "",
                    description: data.description || "",
                    projectTeam: Array.isArray(data.projectTeam) ? data.projectTeam : [],
                    image: data.image || ""
                };
                setForm(projectData);
                setEditorContent(htmlDescription);
            } catch (err) {
                console.error('Error fetching project:', err);
                setError(err.message || "Failed to load project");
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchProject();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddAuthor = () => {
        if (authorInput.trim() && !form.projectTeam.includes(authorInput.trim())) {
            setForm({ ...form, projectTeam: [...form.projectTeam, authorInput.trim()] });
            setAuthorInput("");
        }
    };

    const handleRemoveAuthor = (author) => {
        setForm({ ...form, projectTeam: form.projectTeam.filter(a => a !== author) });
    };

    const handleProjectImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageUploading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('http://localhost:5001/research-projects/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (!data.url) throw new Error('Image upload failed');
            setForm(prev => ({ ...prev, image: data.url }));
        } catch (err) {
            setError(err.message || 'Image upload failed');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        setError("");
        try {
            await updateResearchProject(id, form);
            alert('Project updated successfully!');
            router.push('/dashboard/programs/research-projects');
        } catch (err) {
            setError(err.message || 'Failed to update project');
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
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    placeholder="e.g., Climate Adaptation"
                                    className="h-12 border-2 focus:border-blue-500 transition-all"
                                />
                            </div>
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
                        />
                        <p className="text-xs text-slate-500">
                            {editorContent.replace(/<[^>]*>/g, '').length} characters
                        </p>
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

                {/* Action Buttons */}
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