"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCapacityProject, updateCapacityProject, deleteCapacityProject, uploadImage, uploadResource } from '@/services/capacityBuildingService';
import { ArrowLeft, Save, FileText, Calendar, MapPin, Info, X, ImagePlus, FileUp, Trash2, CheckCircle2, Clock, Users, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditCapacityBuildingPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [form, setForm] = useState({
        title: "",
        date: "",
        location: "",
        status: "Ongoing" as string,
        category: "",
        description: "",
        image: "",
        objectives: [] as string[],
        partners: [] as string[],
        outcomes: [] as string[],
        availableResources: [] as string[],
    });

    const [objectiveInput, setObjectiveInput] = useState("");
    const [partnerInput, setPartnerInput] = useState("");
    const [outcomeInput, setOutcomeInput] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        async function fetchProject() {
            try {
                const data = await getCapacityProject(id);
                setForm({
                    title: data.title || "",
                    date: data.date || "",
                    location: data.location || "",
                    status: data.status || "Ongoing",
                    category: data.category || "",
                    description: data.description || "",
                    image: data.image || "",
                    objectives: data.objectives || [],
                    partners: data.partners || [],
                    outcomes: data.outcomes || [],
                    availableResources: data.availableResources || [],
                });
                setEditorContent(data.description || '');
            } catch (err: any) {
                setError(err.message || 'Failed to load project');
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchProject();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (val: string) => {
        setForm({ ...form, status: val });
    };

    const handleAddObjective = () => {
        if (objectiveInput.trim() && !form.objectives.includes(objectiveInput.trim())) {
            setForm({ ...form, objectives: [...form.objectives, objectiveInput.trim()] });
            setObjectiveInput("");
        }
    };
    const handleRemoveObjective = (item: string) => {
        setForm({ ...form, objectives: form.objectives.filter(i => i !== item) });
    };

    const handleAddPartner = () => {
        if (partnerInput.trim() && !form.partners.includes(partnerInput.trim())) {
            setForm({ ...form, partners: [...form.partners, partnerInput.trim()] });
            setPartnerInput("");
        }
    };
    const handleRemovePartner = (item: string) => {
        setForm({ ...form, partners: form.partners.filter(i => i !== item) });
    };

    const handleAddOutcome = () => {
        if (outcomeInput.trim() && !form.outcomes.includes(outcomeInput.trim())) {
            setForm({ ...form, outcomes: [...form.outcomes, outcomeInput.trim()] });
            setOutcomeInput("");
        }
    };
    const handleRemoveOutcome = (item: string) => {
        setForm({ ...form, outcomes: form.outcomes.filter(i => i !== item) });
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
        if (!form.title || !form.date || !form.location || !form.status) {
            setError('Please fill in all required fields');
            return;
        }
        try {
            setSaving(true);
            setError(null);
            await updateCapacityProject(id, { ...form, description: editorContent });
            router.push('/dashboard/programs/capacity-building');
        } catch (err: any) {
            setError(err.message || 'Failed to update project');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCapacityProject(id);
            router.push('/dashboard/programs/capacity-building');
        } catch (err: any) {
            setError(err.message || 'Failed to delete project');
        }
    };

    const buildImageUrl = (path: string) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `https://api.demo.arin-africa.org${path}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading project...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push('/dashboard/programs/capacity-building')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Edit Capacity Building Project</h1>
                            <p className="text-slate-600 mt-1">Update project information</p>
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
                            <span>Are you sure you want to delete this project? This action cannot be undone.</span>
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
                            <CardDescription>Update the core details of your capacity building project</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Climate Finance and Sustainability Centre"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                        Start Date *
                                    </Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        placeholder="e.g., October 3, 2023"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-500" />
                                        Duration *
                                    </Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        value={form.duration}
                                        onChange={handleChange}
                                        placeholder="e.g., 6 months or Ongoing"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        Location *
                                    </Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="e.g., Pan-African or East Africa"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="participants" className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-slate-500" />
                                        Expected Participants *
                                    </Label>
                                    <Input
                                        id="participants"
                                        name="participants"
                                        value={form.participants}
                                        onChange={handleChange}
                                        placeholder="e.g., 1000+ professionals"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt" className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-slate-500" />
                                    Brief Summary *
                                </Label>
                                <Textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={form.excerpt}
                                    onChange={handleChange}
                                    placeholder="Provide a brief one-paragraph summary for the project card..."
                                    className="min-h-20 resize-none"
                                />
                                <p className="text-xs text-slate-500">{(form.excerpt || "").length} characters</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-500" />
                                    Detailed Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Provide a comprehensive description including training programs, target audience, and impact objectives..."
                                    className="min-h-40 resize-none"
                                />
                                <p className="text-xs text-slate-500">{form.description.length} characters</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status & Category */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Status & Category</CardTitle>
                            </div>
                            <CardDescription>Project status and classification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    placeholder="e.g., Training, Workshop, Certification (optional)"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-slate-500" />
                                    Project Status *
                                </Label>
                                <Select value={form.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ongoing">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                Ongoing
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Completed">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-slate-500"></div>
                                                Completed
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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

                    {/* Objectives */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Objectives</CardTitle>
                            </div>
                            <CardDescription>Project objectives and goals</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="objective-input">Add Objective</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="objective-input"
                                        value={objectiveInput}
                                        onChange={(e) => setObjectiveInput(e.target.value)}
                                        placeholder="e.g., Build capacity in climate finance"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddObjective();
                                            }
                                        }}
                                    />
                                    <Button onClick={handleAddObjective} variant="outline">
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {form.objectives.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Objectives List</Label>
                                    <div className="space-y-2">
                                        {form.objectives.map((obj, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                                                <span className="text-sm">{obj}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveObjective(obj)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Partners */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Partners</CardTitle>
                            </div>
                            <CardDescription>Organizations and institutions involved</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="partner-input">Add Partner</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="partner-input"
                                        value={partnerInput}
                                        onChange={(e) => setPartnerInput(e.target.value)}
                                        placeholder="e.g., UNDP, World Bank"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddPartner();
                                            }
                                        }}
                                    />
                                    <Button onClick={handleAddPartner} variant="outline">
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {form.partners.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Partners List</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {form.partners.map((partner, idx) => (
                                            <Badge key={idx} variant="outline" className="pl-3">
                                                {partner}
                                                <button
                                                    onClick={() => handleRemovePartner(partner)}
                                                    className="ml-2 text-xs hover:text-red-600"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Outcomes */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Outcomes</CardTitle>
                            </div>
                            <CardDescription>Expected results and impacts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="outcome-input">Add Outcome</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="outcome-input"
                                        value={outcomeInput}
                                        onChange={(e) => setOutcomeInput(e.target.value)}
                                        placeholder="e.g., 500+ professionals trained in sustainable finance"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddOutcome();
                                            }
                                        }}
                                    />
                                    <Button onClick={handleAddOutcome} variant="outline">
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {form.outcomes.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Outcomes List</Label>
                                    <div className="space-y-2">
                                        {form.outcomes.map((outcome, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded border">
                                                <span className="text-sm">{outcome}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveOutcome(outcome)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <Button type="button" variant="outline" className="sm:w-auto w-full">
                                    Cancel
                                </Button>
                                <Button type="button" variant="outline" className="sm:w-auto w-full">
                                    Save as Draft
                                </Button>
                                <Button onClick={handleSubmit} className="sm:w-auto w-full bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}