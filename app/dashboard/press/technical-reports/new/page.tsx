"use client";
import { useState } from "react";
import { technicalReportsService } from '@/services/technicalReportsService';
import { ArrowLeft, Save, FileText, Calendar, Upload, ImagePlus, X, Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';

export default function AddTechnicalReport() {
    const [form, setForm] = useState({
        title: "",
        authors: [] as string[],
        authorInput: "",
        description: "",
        image: "",
        availableResources: [] as string[],
        datePosted: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [resourceUploading, setResourceUploading] = useState(false);

    // Author handlers
    const handleAddAuthor = () => {
        const val = form.authorInput.trim();
        if (val && !form.authors.includes(val)) {
            setForm({ ...form, authors: [...form.authors, val], authorInput: "" });
        }
    };
    const handleRemoveAuthor = (author: string) => {
        setForm({ ...form, authors: form.authors.filter(a => a !== author) });
    };

    // Image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const res = await technicalReportsService.uploadImage(file);
            setForm({ ...form, image: res.url });
        } catch (err: any) {
            setError(err.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    // Resource upload
    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setResourceUploading(true);
            const res = await technicalReportsService.uploadResource(file);
            setForm({ ...form, availableResources: [...form.availableResources, res.url] });
        } catch (err: any) {
            setError(err.message || 'Resource upload failed');
        } finally {
            setResourceUploading(false);
        }
    };

    // Description editor
    const [editorContent, setEditorContent] = useState('');

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.description) {
            setError('Please fill in all required fields');
            return;
        }
        setLoading(true);
        setError(null);
        const payload = {
            title: form.title,
            authors: form.authors,
            description: form.description,
            image: form.image,
            availableResources: form.availableResources,
            datePosted: form.datePosted || new Date().toISOString(),
        };
        try {
            await technicalReportsService.create(payload);
            alert('Technical report created successfully!');
            window.location.href = '/dashboard/press/technical-reports';
        } catch (err: any) {
            setError(err.message || 'Failed to create technical report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-white/60 transition-all"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Add Technical Report
                        </h1>
                        <p className="text-slate-600 mt-1">Create a new technical report entry</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                        <X className="h-5 w-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Title */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Title <span className="text-red-500">*</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g., Technical Report 2026"
                                className="text-lg h-12 border-2 focus:border-blue-500"
                                required
                            />
                        </CardContent>
                    </Card>

                    {/* Authors */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Authors</CardTitle>
                            <CardDescription>Add one or more authors</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    value={form.authorInput}
                                    onChange={e => setForm({ ...form, authorInput: e.target.value })}
                                    placeholder="Enter author name"
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddAuthor(); } }}
                                />
                                <Button type="button" onClick={handleAddAuthor}>Add</Button>
                            </div>
                            {form.authors.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {form.authors.map((author, idx) => (
                                        <Badge key={idx} className="px-3 py-2 bg-white border-2 border-blue-200 text-blue-800">
                                            {author}
                                            <button type="button" className="ml-2 text-red-500 hover:text-red-700 font-bold" onClick={() => handleRemoveAuthor(author)}>×</button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cover Image */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Cover Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="h-12 border-2 focus:border-blue-500"
                            />
                            {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
                            {form.image && (
                                <div className="mt-4">
                                    <img src={form.image} alt="Cover preview" className="w-full max-w-md h-auto rounded-lg shadow-md" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Description <span className="text-red-500">*</span></CardTitle>
                            <CardDescription>Rich text, images supported</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImprovedTiptapEditor
                                value={editorContent}
                                onChange={html => { setEditorContent(html); setForm({ ...form, description: html }); }}
                                placeholder="Enter detailed description with images, formatting, and links..."
                                uploadUrl="https://api.demo.arin-africa.org/api/technical-reports/upload"
                                uploadFieldName="file"
                            />
                            <p className="text-xs text-slate-500">{editorContent.replace(/<[^>]*>/g, '').length} characters</p>
                        </CardContent>
                    </Card>

                    {/* Available Resources */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Available Resources (PDFs, etc.)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                id="resource"
                                type="file"
                                accept="application/pdf"
                                onChange={handleResourceUpload}
                                className="h-12 border-2 focus:border-blue-500"
                            />
                            {resourceUploading && <p className="text-sm text-gray-600">Uploading...</p>}
                            {form.availableResources.length > 0 && (
                                <ul className="mt-2 space-y-2">
                                    {form.availableResources.map((url, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <Paperclip className="w-4 h-4 text-blue-600" />
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Resource {idx + 1}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg" disabled={loading}>
                            <Save className="mr-2 h-5 w-5" />
                            {loading ? 'Creating...' : 'Create Technical Report'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
