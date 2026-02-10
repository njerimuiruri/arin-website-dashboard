"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, ArrowLeft, ImagePlus, Info, X, Upload } from 'lucide-react';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { createCsr, uploadCsrImage } from '@/services/csrService';


export default function NewCSRPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        date: "",
        image: "",
        description: "",
        availableResources: [] as string[],
    });
    const [editorContent, setEditorContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const url = await uploadCsrImage(file);
            setForm({ ...form, image: url });
        } catch (err: any) {
            setError(err.message || 'Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.title || !form.date || !form.description) {
            setError('Please fill in all required fields');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const payload = {
                title: form.title,
                date: form.date,
                image: form.image,
                description: form.description,
                availableResources: form.availableResources,
            };
            await createCsr(payload);
            alert('CSR created successfully!');
            router.push('/dashboard/opportunities/csr');
        } catch (err: any) {
            setError(err.message || 'Failed to create CSR');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
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
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Add New CSR Activity
                        </h1>
                        <p className="text-slate-600 mt-1">Create a new CSR entry with images and resources</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 animate-in slide-in-from-top">
                        <X className="h-5 w-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Save className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Basic Information</CardTitle>
                                    <CardDescription>Enter the core details of your CSR activity</CardDescription>
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
                                    placeholder="e.g., Community Clean-Up Drive"
                                    className="text-lg h-12 border-2 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2">
                                    Date <span className="text-red-500">*</span>
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
                        </CardContent>
                    </Card>

                    <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <ImagePlus className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Main Image</CardTitle>
                                    <CardDescription>Upload a main image for this CSR activity</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-base font-semibold">
                                    Main Image
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
                                            src={form.image.startsWith('http') ? form.image : `https://api.demo.arin-africa.org${form.image}`}
                                            alt="CSR preview"
                                            className="w-full max-w-md h-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <Info className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Description</CardTitle>
                                    <CardDescription>Provide detailed information with formatting and images</CardDescription>
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
                                placeholder="Enter detailed CSR description with images, formatting, and links..."
                                uploadUrl="https://api.demo.arin-africa.org/api/csr/upload"
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
                                    type="submit"
                                    className="sm:w-auto w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                                    disabled={loading}
                                >
                                    <Save className="mr-2 h-5 w-5" />
                                    {loading ? 'Creating CSR...' : 'Create CSR'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}