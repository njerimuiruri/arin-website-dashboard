"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPolicyDialogue, uploadImage, uploadResource } from '@/services/policyDialoguesService';
import { ArrowLeft, Save, FileText, Calendar, Info, X, ImagePlus, FileUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreatePolicyDialoguePage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        date: "",
        status: "Ongoing" as "Ongoing" | "Completed" | "Incomplete" | undefined,
        description: "",
        image: "",
        availableResources: [] as string[],
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (val: "Ongoing" | "Completed" | "Incomplete") => {
        setForm({ ...form, status: val });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const res = await uploadImage(file);
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
            setUploadingResource(true);
            const res = await uploadResource(file);
            setForm({ ...form, availableResources: [...form.availableResources, res.url] });
        } catch (err: any) {
            setError(err.message || 'Resource upload failed');
        } finally {
            setUploadingResource(false);
        }
    };

    const handleRemoveResource = (url: string) => {
        setForm({ ...form, availableResources: form.availableResources.filter(r => r !== url) });
    };

    const handleSubmit = async () => {
        if (!form.title || !form.date || !form.status || !editorContent) {
            setError('Please fill in all required fields');
            return;
        }
        try {
            setSaving(true);
            setError(null);
            await createPolicyDialogue({ ...form, description: editorContent });
            router.push('/dashboard/programs/policy-dialogues');
        } catch (err: any) {
            setError(err.message || 'Failed to create dialogue');
        } finally {
            setSaving(false);
        }
    };

    const buildImageUrl = (path: string) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `https://api.demo.arin-africa.org${path}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push('/dashboard/programs/policy-dialogues')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Create Policy Dialogue</h1>
                        <p className="text-slate-600 mt-1">Add a new policy dialogue session</p>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Basic Information</CardTitle>
                            </div>
                            <CardDescription>Enter the core details of your policy dialogue</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Dialogue Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Climate Finance Policy Dialogue"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                        Dialogue Date *
                                    </Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        placeholder="e.g., January 15, 2024"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status" className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-slate-500" />
                                        Status *
                                    </Label>
                                    <Select value={form.status} onValueChange={handleStatusChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Incomplete">Incomplete</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <ImprovedTiptapEditor
                                    value={editorContent}
                                    onChange={setEditorContent}
                                    uploadUrl="https://api.demo.arin-africa.org/policy-dialogue/upload"
                                    uploadFieldName="file"
                                />
                                <p className="text-xs text-slate-500">{editorContent.length} characters</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Image */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ImagePlus className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Main Image</CardTitle>
                            </div>
                            <CardDescription>Upload the main image for this dialogue</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image-upload">Upload Image</Label>
                                <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading && <p className="text-xs text-slate-500">Uploading...</p>}
                            </div>

                            {form.image && (
                                <div className="space-y-2">
                                    <Label>Current Image</Label>
                                    <div className="relative h-48 rounded-lg overflow-hidden border">
                                        <img src={buildImageUrl(form.image)} alt="Dialogue" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resources */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileUp className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Available Resources</CardTitle>
                            </div>
                            <CardDescription>Upload PDF resources for download</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="resource-upload">Upload Resource (PDF)</Label>
                                <Input
                                    id="resource-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleResourceUpload}
                                    disabled={uploadingResource}
                                />
                                {uploadingResource && <p className="text-xs text-slate-500">Uploading...</p>}
                            </div>

                            {form.availableResources && form.availableResources.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Uploaded Resources</Label>
                                    <div className="space-y-2">
                                        {form.availableResources.map((resource, idx) => {
                                            const fileName = resource.split('/').pop() || `Resource ${idx + 1}`;
                                            return (
                                                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                                                    <span className="text-sm">{fileName}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveResource(resource)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <Button type="button" variant="outline" className="sm:w-auto w-full" onClick={() => router.push('/dashboard/programs/policy-dialogues')}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={saving} className="sm:w-auto w-full bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving ? 'Creating...' : 'Create Dialogue'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
