"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { workingPaperSeriesService } from '@/services/workingPaperSeriesService';
import { ArrowLeft, Save, FileText, Calendar, Info, X, ImagePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';


export default function EditWorkingPaper() {
    const { id } = useParams();
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        datePosted: "",
        description: "",
        image: "",
        availableResources: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [resourceUploading, setResourceUploading] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        if (!id) return;
        setFetching(true);
        workingPaperSeriesService.getById(id as string)
            .then((data) => {
                setForm({
                    title: data.title || "",
                    datePosted: data.datePosted ? data.datePosted.slice(0, 16) : "",
                    description: data.description || "",
                    image: data.image || "",
                    availableResources: data.availableResources || [],
                });
                setEditorContent(data.description || '');
            })
            .catch((err) => setError(err.message))
            .finally(() => setFetching(false));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const res = await workingPaperSeriesService.uploadImage(file);
            setForm({ ...form, image: res.url });
        } catch (err: any) {
            setError(err.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setResourceUploading(true);
            const res = await workingPaperSeriesService.uploadResource(file);
            setForm((prev) => ({ ...prev, availableResources: [...prev.availableResources, res.url] }));
        } catch (err: any) {
            setError(err.message || 'Resource upload failed');
        } finally {
            setResourceUploading(false);
        }
    };

    const handleRemoveResource = (idx: number) => {
        setForm((prev) => ({ ...prev, availableResources: prev.availableResources.filter((_, i) => i !== idx) }));
    };

    const handleSubmit = async () => {
        if (!form.title || !form.datePosted || !form.description) {
            setError('Please fill in all required fields');
            return;
        }
        setLoading(true);
        setError(null);
        const payload = {
            title: form.title,
            datePosted: form.datePosted,
            description: form.description,
            image: form.image,
            availableResources: form.availableResources,
        };
        try {
            await workingPaperSeriesService.update(id as string, payload);
            alert('Working paper updated successfully!');
            router.push(`/dashboard/press/working-papers/${id}`);
        } catch (err: any) {
            setError(err.message || 'Failed to update working paper');
        } finally {
            setLoading(false);
        }
    };
    <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-linear-to-r from-green-50 to-blue-50 border-b">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                    <CardTitle className="text-2xl">Available Resources</CardTitle>
                    <CardDescription>Upload PDF or other files for this working paper</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
                <Label htmlFor="resource" className="text-base font-semibold">
                    Add Resource (PDF, etc)
                </Label>
                <Input
                    id="resource"
                    type="file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleResourceUpload}
                    className="h-12 border-2 focus:border-green-500"
                />
                {resourceUploading && <p className="text-sm text-gray-600">Uploading resource...</p>}
                {form.availableResources.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {form.availableResources.map((url, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <a href={url.startsWith('http') ? url : `http://localhost:5001${url}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                                    Resource {idx + 1}
                                </a>
                                <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveResource(idx)}>
                                    <X className="h-4 w-4 text-red-500" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </CardContent>
    </Card>

    if (fetching) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
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
                            Edit Working Paper
                        </h1>
                        <p className="text-slate-600 mt-1">Update the details of this working paper</p>
                    </div>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 animate-in slide-in-from-top">
                        <X className="h-5 w-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}
                <div className="space-y-6">
                    <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Basic Information</CardTitle>
                                    <CardDescription>Edit the core details of your working paper</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Advances in African Research, 2026"
                                    className="text-lg h-12 border-2 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="datePosted" className="text-base font-semibold flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="datePosted"
                                    name="datePosted"
                                    type="datetime-local"
                                    value={form.datePosted}
                                    onChange={handleChange}
                                    className="h-12 border-2 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <ImagePlus className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Cover Image</CardTitle>
                                    <CardDescription>Upload a cover image for this working paper</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-base font-semibold">
                                    Cover Image
                                </Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="h-12 border-2 focus:border-purple-500"
                                />
                                {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
                                {form.image && (
                                    <div className="mt-4">
                                        <img
                                            src={form.image.startsWith('http') ? form.image : `http://localhost:5001${form.image}`}
                                            alt="Cover preview"
                                            className="w-full max-w-md h-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-linear-to-r from-indigo-50 to-purple-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <Info className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Description</CardTitle>
                                    <CardDescription>Edit the detailed description with formatting and images</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <ImprovedTiptapEditor
                                value={editorContent}
                                onChange={(html) => {
                                    setEditorContent(html);
                                    setForm({ ...form, description: html });
                                }}
                                placeholder="Enter detailed description with images, formatting, and links..."
                                uploadUrl="http://localhost:5001/api/working-paper-series/upload"
                                uploadFieldName="file"
                            />
                            <p className="text-xs text-slate-500">
                                {editorContent.replace(/<[^>]*>/g, '').length} characters
                            </p>
                        </CardContent>
                    </Card>
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
                                    disabled={loading}
                                >
                                    <Save className="mr-2 h-5 w-5" />
                                    {loading ? 'Updating...' : 'Update Working Paper'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
