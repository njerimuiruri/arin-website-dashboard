"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCapacityProject, uploadImage, uploadResource } from '@/services/capacityBuildingService';
import { ArrowLeft, Save, FileText, Calendar, MapPin, Info, X, ImagePlus, FileUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewCapacityBuildingPage() {
    const router = useRouter();
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

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingResource, setUploadingResource] = useState(false);

    const [editorContent, setEditorContent] = useState('');

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
        if (!form.title || !form.date || !form.status || !form.location || !form.description) {
            setError('Please fill in all required fields (title, date, status, location, description)');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await createCapacityProject(form);
            console.log('Project created:', result);
            alert('Capacity building project created successfully!');
            router.push('/dashboard/programs/capacity-building');
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900">
                            Add New Capacity Building Project
                        </h1>
                        <p className="text-slate-600 mt-1">Create a training and capacity development initiative</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                        <X className="h-5 w-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-emerald-50 to-green-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-600 rounded-lg">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Basic Information</CardTitle>
                                    <CardDescription>Enter core details of your capacity building project</CardDescription>
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
                                    placeholder="e.g., Climate Finance and Sustainability Centre"
                                    className="text-lg h-12 border-2"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                        Start Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        className="h-12 border-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        Location <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="e.g., Pan-African, East Africa"
                                        className="h-12 border-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-base font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        Project Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={form.status} onValueChange={handleStatusChange}>
                                        <SelectTrigger className="h-12 border-2">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="text-base font-semibold">
                                        Category (optional)
                                    </Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        placeholder="e.g., Training, Workshop (optional)"
                                        className="h-12 border-2"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Project Image */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <ImagePlus className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Project Image</CardTitle>
                                    <CardDescription>Upload a main image for this project</CardDescription>
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
                                    className="h-12 border-2"
                                />
                                {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
                                {form.image && (
                                    <div className="mt-4">
                                        <img
                                            src={`http://localhost:5001${form.image}`}
                                            alt="Project preview"
                                            className="w-full max-w-md h-auto rounded-lg shadow-md"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Description */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-indigo-50 to-purple-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-600 rounded-lg">
                                    <Info className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Project Description</CardTitle>
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
                                placeholder="Enter detailed project description..."
                                uploadUrl="http://localhost:5001/api/capacity-building/upload"
                                uploadFieldName="file"
                            />
                            <p className="text-xs text-slate-500">
                                {editorContent.replace(/<[^>]*>/g, '').length} characters
                            </p>
                        </CardContent>
                    </Card>

                    {/* Objectives */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Objectives</CardTitle>
                                    <CardDescription>Add key objectives for this capacity building project</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex gap-2">
                                <Input
                                    value={objectiveInput}
                                    onChange={e => setObjectiveInput(e.target.value)}
                                    placeholder="Enter objective"
                                    className="h-12 border-2"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddObjective();
                                        }
                                    }}
                                />
                                <Button onClick={handleAddObjective} className="h-12 px-6 bg-blue-600">
                                    Add
                                </Button>
                            </div>
                            {form.objectives.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {form.objectives.map((obj, i) => (
                                        <Badge key={i} variant="secondary" className="text-sm px-3 py-1 flex items-center gap-2">
                                            {obj}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveObjective(obj)} />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Partners */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-teal-50 to-emerald-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-600 rounded-lg">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Partners</CardTitle>
                                    <CardDescription>Add partner organizations</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex gap-2">
                                <Input
                                    value={partnerInput}
                                    onChange={e => setPartnerInput(e.target.value)}
                                    placeholder="Enter partner name"
                                    className="h-12 border-2"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddPartner();
                                        }
                                    }}
                                />
                                <Button onClick={handleAddPartner} className="h-12 px-6 bg-teal-600">
                                    Add
                                </Button>
                            </div>
                            {form.partners.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {form.partners.map((p, i) => (
                                        <Badge key={i} variant="secondary" className="text-sm px-3 py-1 flex items-center gap-2">
                                            {p}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemovePartner(p)} />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Outcomes */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-600 rounded-lg">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Outcomes</CardTitle>
                                    <CardDescription>Add expected or achieved outcomes</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex gap-2">
                                <Input
                                    value={outcomeInput}
                                    onChange={e => setOutcomeInput(e.target.value)}
                                    placeholder="Enter outcome"
                                    className="h-12 border-2"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddOutcome();
                                        }
                                    }}
                                />
                                <Button onClick={handleAddOutcome} className="h-12 px-6 bg-amber-600">
                                    Add
                                </Button>
                            </div>
                            {form.outcomes.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {form.outcomes.map((o, i) => (
                                        <Badge key={i} variant="secondary" className="text-sm px-3 py-1 flex items-center gap-2">
                                            {o}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveOutcome(o)} />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resources (PDFs) */}
                    <Card className="border-2 shadow-lg">
                        <CardHeader className="bg-linear-to-r from-slate-50 to-gray-50 border-b">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-600 rounded-lg">
                                    <FileUp className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Available Resources</CardTitle>
                                    <CardDescription>Upload PDFs or documents (optional)</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="resource" className="text-base font-semibold">
                                    Upload Resource (PDF)
                                </Label>
                                <Input
                                    id="resource"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleResourceUpload}
                                    className="h-12 border-2"
                                />
                                {uploadingResource && <p className="text-sm text-gray-600">Uploading resource...</p>}
                            </div>
                            {form.availableResources.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm font-semibold">Uploaded Resources:</p>
                                    {form.availableResources.map((url, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 border rounded">
                                            <a href={`http://localhost:5001${url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline">
                                                {url.split('/').pop()}
                                            </a>
                                            <Button variant="ghost" size="sm" onClick={() => handleRemoveResource(url)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="sm:w-auto w-full"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="sm:w-auto w-full bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {loading ? 'Creating...' : 'Create Project'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
