"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";
import { ArrowLeft, Save, FileText, Calendar, CheckCircle2, ImagePlus, FileUp, X } from "lucide-react";
import { updatePolicyDialogue, uploadImage, uploadResource, getPolicyDialogue, deletePolicyDialogue } from "@/services/policyDialoguesService";

export default function EditDialoguePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [editorContent, setEditorContent] = useState("");
    const [form, setForm] = useState({
        title: "",
        date: "",
        status: "Ongoing",
        image: "",
        availableResources: [] as string[]
    });

    useEffect(() => {
        const fetchDialogue = async () => {
            try {
                console.log('Fetching dialogue with ID:', id);
                const data = await getPolicyDialogue(id);
                console.log('Fetched dialogue data:', data);
                if (!data) {
                    setError("Dialogue not found");
                    return;
                }
                setForm({
                    title: data.title || "",
                    date: data.date || "",
                    status: data.status || "Ongoing",
                    image: data.image || "",
                    availableResources: data.availableResources || []
                });
                console.log('Setting editor content:', data.description);
                setEditorContent(data.description || "");
            } catch (err) {
                console.error('Error fetching dialogue:', err);
                setError("Failed to load dialogue");
            } finally {
                setLoading(false);
            }
        };

        fetchDialogue();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (value: string) => {
        setForm(prev => ({ ...prev, status: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const path = await uploadImage(file);
            setForm(prev => ({ ...prev, image: path.url }));
            setError("");
        } catch (err) {
            setError("Failed to upload image");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingResource(true);
        try {
            const path = await uploadResource(file);
            setForm(prev => ({
                ...prev,
                availableResources: [...prev.availableResources, path.url]
            }));
            setError("");
        } catch (err) {
            setError("Failed to upload resource");
            console.error(err);
        } finally {
            setUploadingResource(false);
        }
    };

    const handleRemoveResource = (resourcePath: string) => {
        setForm(prev => ({
            ...prev,
            availableResources: prev.availableResources.filter(r => r !== resourcePath)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setError("Title is required");
            return;
        }

        setSaving(true);
        try {
            await updatePolicyDialogue(id, {
                title: form.title,
                date: form.date,
                status: form.status as "Ongoing" | "Completed" | "Incomplete",
                image: form.image,
                description: editorContent,
                availableResources: form.availableResources
            });
            router.push(`/dashboard/convening-platforms/policy-dialogues/${id}`);
        } catch (err) {
            setError("Failed to update dialogue");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const buildImageUrl = (path: string) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `https://api.demo.arin-africa.org${path}`;
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error && !form.title) return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-linear-to-br from-yellow-50 via-white to-blue-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push(`/dashboard/convening-platforms/policy-dialogues/${id}`)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-yellow-900">Edit Policy Dialogue</h1>
                        <p className="text-yellow-700 mt-1">Update the dialogue details</p>
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
                                <FileText className="h-5 w-5 text-yellow-600" />
                                <CardTitle>Basic Information</CardTitle>
                            </div>
                            <CardDescription>Edit the core details of your policy dialogue</CardDescription>
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
                                        <Calendar className="h-4 w-4 text-yellow-600" />
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
                                        <CheckCircle2 className="h-4 w-4 text-yellow-600" />
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
                                    uploadFieldName="image"
                                />
                                <p className="text-xs text-gray-500">{editorContent.length} characters</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Image */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <ImagePlus className="h-5 w-5 text-yellow-600" />
                                <CardTitle>Main Image</CardTitle>
                            </div>
                            <CardDescription>Update the main image for this dialogue</CardDescription>
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
                                {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
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
                                <FileUp className="h-5 w-5 text-yellow-600" />
                                <CardTitle>Available Resources</CardTitle>
                            </div>
                            <CardDescription>Manage PDF resources for download</CardDescription>
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
                                {uploadingResource && <p className="text-xs text-gray-500">Uploading...</p>}
                            </div>

                            {form.availableResources && form.availableResources.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Uploaded Resources</Label>
                                    <div className="space-y-2">
                                        {form.availableResources.map((resource, idx) => {
                                            const fileName = resource.split('/').pop() || `Resource ${idx + 1}`;
                                            return (
                                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
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
                                <Button type="button" variant="outline" className="sm:w-auto w-full" onClick={() => router.push(`/dashboard/convening-platforms/policy-dialogues/${id}`)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} disabled={saving} className="sm:w-auto w-full bg-yellow-600 hover:bg-yellow-700">
                                    <Save className="mr-2 h-4 w-4" />
                                    {saving ? 'Updating...' : 'Update Dialogue'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}