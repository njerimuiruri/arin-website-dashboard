"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { newslettersService } from "@/services/newslettersService";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';

export default function AddNewsletter() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        description: "",
        authors: [] as string[],
        authorInput: "",
        image: "",
        year: new Date().getFullYear(),
        datePosted: new Date().toISOString().slice(0, 10),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [editorContent, setEditorContent] = useState('');

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
            const res = await newslettersService.uploadImage(file);
            setForm({ ...form, image: res.url });
        } catch (err: any) {
            setError(err.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

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
            description: form.description,
            authors: form.authors,
            image: form.image,
            year: form.year,
            datePosted: form.datePosted,
        };
        try {
            await newslettersService.create(payload);
            alert('Newsletter created successfully!');
            router.push(`/dashboard/press/newsletters`);
        } catch (err: any) {
            setError(err.message || 'Failed to create newsletter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    Add Newsletter
                </h1>
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-4">{error}</div>
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
                                placeholder="e.g., January 2026 Newsletter"
                                className="text-lg h-12 border-2 focus:border-blue-500"
                                required
                            />
                        </CardContent>
                    </Card>

                    {/* Authors */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Authors</CardTitle>
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
                        </CardHeader>
                        <CardContent>
                            <ImprovedTiptapEditor
                                value={editorContent}
                                onChange={html => { setEditorContent(html); setForm({ ...form, description: html }); }}
                                placeholder="Enter newsletter content with images, formatting, and links..."
                                uploadUrl="http://localhost:5001/api/newsletters/upload"
                                uploadFieldName="file"
                            />
                            <p className="text-xs text-slate-500">{editorContent.replace(/<[^>]*>/g, '').length} characters</p>
                        </CardContent>
                    </Card>

                    {/* Year and Date */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader>
                            <CardTitle>Year & Date</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    min="2000"
                                    max={new Date().getFullYear() + 1}
                                    value={form.year}
                                    onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
                                    placeholder="Year"
                                    className="w-32"
                                />
                                <Input
                                    type="date"
                                    value={form.datePosted}
                                    onChange={e => setForm({ ...form, datePosted: e.target.value })}
                                    className="w-48"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Newsletter'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
