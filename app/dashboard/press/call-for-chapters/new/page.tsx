"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { callForBooksService } from '@/services/callForBooksService';


export default function NewCallPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        description: "",
        coverImage: "",
        date: "",
        deadline: "",
        availableResources: [] as string[],
    });
    const [editorContent, setEditorContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [resourceUploading, setResourceUploading] = useState(false);
    const [resourceError, setResourceError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const res = await callForBooksService.uploadImage(file);
            setForm({ ...form, coverImage: res.url });
        } catch (err: any) {
            setError(err.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setResourceError('Only PDF files are allowed');
            return;
        }
        try {
            setResourceUploading(true);
            setResourceError(null);
            const res = await callForBooksService.uploadResource(file);
            setForm(prev => ({ ...prev, availableResources: [...prev.availableResources, res.url] }));
        } catch (err: any) {
            setResourceError(err.message || 'PDF upload failed');
        } finally {
            setResourceUploading(false);
        }
    };

    const handleRemoveResource = (url: string) => {
        setForm(prev => ({ ...prev, availableResources: prev.availableResources.filter(r => r !== url) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.date || !form.deadline) {
            setError('Please fill in all required fields');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await callForBooksService.create({
                title: form.title,
                description: form.description,
                image: form.coverImage,
                datePosted: form.date,
                deadline: form.deadline,
                availableResources: form.availableResources,
            });
            alert('Call for Book Chapters created successfully!');
            router.push('/dashboard/press/call-for-chapters');
        } catch (err: any) {
            setError(err.message || 'Failed to create call');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-white/60"
                        onClick={() => router.back()}
                    >
                        ←
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">
                            Add New Call for Book Chapters
                        </h1>
                        <p className="text-slate-600 mt-1">Create a new call for book chapters</p>
                    </div>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                        <span className="text-red-600 font-bold">!</span>
                        <p className="text-red-800">{error}</p>
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Title */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Title <span className="text-red-500">*</span></CardTitle>
                            <CardDescription>Enter the title for the call</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g., Call for Book Chapters on Climate Action"
                                required
                            />
                        </CardContent>
                    </Card>
                    {/* Cover Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cover Image</CardTitle>
                            <CardDescription>Upload a cover image for this call</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="coverImage">Cover Image</Label>
                            <Input
                                id="coverImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
                            {form.coverImage && (
                                <div className="mt-4">
                                    <img
                                        src={form.coverImage.startsWith('http') ? form.coverImage : `https://api.demo.arin-africa.org${form.coverImage}`}
                                        alt="Cover preview"
                                        className="w-full max-w-md h-auto rounded-lg shadow-md"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    {/* Description (WYSIWYG) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description <span className="text-red-500">*</span></CardTitle>
                            <CardDescription>Provide a detailed description. You can upload images.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ImprovedTiptapEditor
                                value={editorContent}
                                onChange={html => {
                                    setEditorContent(html);
                                    setForm({ ...form, description: html });
                                }}
                                placeholder="Enter the call description, requirements, and more..."
                                uploadUrl="https://api.demo.arin-africa.org/api/call-for-books/upload-description-image"
                                uploadFieldName="image"
                            />
                            <p className="text-xs text-slate-500">
                                {editorContent.replace(/<[^>]*>/g, '').length} characters
                            </p>
                        </CardContent>
                    </Card>
                    {/* Date and Deadline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Dates <span className="text-red-500">*</span></CardTitle>
                            <CardDescription>Set the date posted and deadline</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="date">Date Posted</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="deadline">Deadline</Label>
                                <Input
                                    id="deadline"
                                    name="deadline"
                                    type="date"
                                    value={form.deadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>
                    {/* Available Resources (PDF Upload) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Resources (PDF)</CardTitle>
                            <CardDescription>Upload PDF files related to this call (e.g., guidelines, templates)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input
                                id="resource"
                                type="file"
                                accept="application/pdf"
                                onChange={handleResourceUpload}
                                disabled={resourceUploading}
                            />
                            {resourceUploading && <p className="text-sm text-gray-600">Uploading PDF...</p>}
                            {resourceError && <p className="text-sm text-red-600">{resourceError}</p>}
                            {form.availableResources.length > 0 && (
                                <ul className="mt-4 space-y-2">
                                    {form.availableResources.map((url, idx) => (
                                        <li key={idx} className="flex items-center gap-2 bg-slate-100 rounded p-2">
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">Resource {idx + 1}</a>
                                            <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveResource(url)}>
                                                Remove
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="sm:w-auto w-full"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="sm:w-auto w-full bg-gradient-to-r from-pink-600 to-indigo-600 text-lg font-semibold shadow-lg"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Call'}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
