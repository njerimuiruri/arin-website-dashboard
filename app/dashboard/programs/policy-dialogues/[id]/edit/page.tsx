"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPolicyDialogue, updatePolicyDialogue, deletePolicyDialogue, uploadImage, uploadResource } from '@/services/policyDialoguesService';
import { ArrowLeft, Save, FileText, Calendar, Info, X, ImagePlus, FileUp, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditPolicyDialoguePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [form, setForm] = useState({
        title: "",
        date: "",
        status: "Ongoing" as string,
        description: "",
        image: "",
        availableResources: [] as string[],
    });

    const [resourceInput, setResourceInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        async function fetchDialogue() {
            try {
                const data = await getPolicyDialogue(id);
                setForm({
                    title: data.title || "",
                    date: data.date || "",
                    status: data.status || "Ongoing",
                    description: data.description || "",
                    image: data.image || "",
                    availableResources: data.availableResources || [],
                });
                setEditorContent(data.description || '');
            } catch (err: any) {
                setError(err.message || 'Failed to load dialogue');
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchDialogue();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (val: string) => {
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
        if (!form.title || !form.date || !form.status) {
            setError('Please fill in all required fields');
            return;
        }
        try {
            setSaving(true);
            setError(null);
            await updatePolicyDialogue(id, { ...form, description: editorContent });
            router.push('/dashboard/programs/policy-dialogues');
        } catch (err: any) {
            setError(err.message || 'Failed to update dialogue');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePolicyDialogue(id);
            router.push('/dashboard/programs/policy-dialogues');
        } catch (err: any) {
            setError(err.message || 'Failed to delete dialogue');
        }
    };

    const buildImageUrl = (path: string) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `http://localhost:5001${path}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dialogue...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push('/dashboard/programs/policy-dialogues')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Edit Policy Dialogue</h1>
                            <p className="text-slate-600 mt-1">Update dialogue information</p>
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <Alert variant="destructive">
                        <AlertDescription className="flex items-center justify-between">
                            <span>Are you sure you want to delete this dialogue? This action cannot be undone.</span>
                            <div className="flex gap-2 ml-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

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
                            <CardDescription>Update the core details of your policy dialogue</CardDescription>
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
                                    content={editorContent}
                                    onChange={setEditorContent}
                                    uploadUrl="http://localhost:5001/policy-dialogue/upload"
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
                            <CardDescription>Upload or update the main image for this dialogue</CardDescription>
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
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
