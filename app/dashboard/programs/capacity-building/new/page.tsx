"use client";
import { useState } from "react";
import { ArrowLeft, Save, FileText, Calendar, MapPin, Users, Clock, Tag, Info, CheckCircle2, Target, DollarSign, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function NewCapacityBuildingPage() {
    const [form, setForm] = useState({
        title: "",
        date: "",
        location: "",
        duration: "",
        participants: "",
        excerpt: "",
        description: "",
        tags: "",
        status: "Ongoing",
        budget: "",
        trainingModules: "",
        facilitators: "",
        fundingPartners: "",
        targetAudience: "",
        objectives: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (value) => {
        setForm({ ...form, status: value });
    };

    const handleSubmit = () => {
        console.log("Project created:", form);
    };

    const tagArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(t => t) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Add New Capacity Building Project</h1>
                        <p className="text-slate-600 mt-1">Create a new training and development initiative</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Basic Information</CardTitle>
                            </div>
                            <CardDescription>Enter the core details of your capacity building project</CardDescription>
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
                                    className="min-h-[80px] resize-none"
                                />
                                <p className="text-xs text-slate-500">{form.excerpt.length} characters</p>
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
                                    className="min-h-[160px] resize-none"
                                />
                                <p className="text-xs text-slate-500">{form.description.length} characters</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Program Details */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Program Details</CardTitle>
                            </div>
                            <CardDescription>Specific information about the training program</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="targetAudience">Target Audience</Label>
                                <Textarea
                                    id="targetAudience"
                                    name="targetAudience"
                                    value={form.targetAudience}
                                    onChange={handleChange}
                                    placeholder="e.g., Government officials, Financial sector professionals, NGO leaders..."
                                    className="min-h-[80px] resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="objectives" className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-slate-500" />
                                    Program Objectives
                                </Label>
                                <Textarea
                                    id="objectives"
                                    name="objectives"
                                    value={form.objectives}
                                    onChange={handleChange}
                                    placeholder="List the key objectives and expected outcomes of the program..."
                                    className="min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="trainingModules" className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-slate-500" />
                                        Number of Training Modules
                                    </Label>
                                    <Input
                                        id="trainingModules"
                                        name="trainingModules"
                                        type="number"
                                        value={form.trainingModules}
                                        onChange={handleChange}
                                        placeholder="e.g., 12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="budget" className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-slate-500" />
                                        Budget
                                    </Label>
                                    <Input
                                        id="budget"
                                        name="budget"
                                        value={form.budget}
                                        onChange={handleChange}
                                        placeholder="e.g., $5.2M"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="facilitators">Lead Facilitators</Label>
                                <Input
                                    id="facilitators"
                                    name="facilitators"
                                    value={form.facilitators}
                                    onChange={handleChange}
                                    placeholder="e.g., Dr. Amina Mohamed, Prof. Kwabena Osei (comma separated)"
                                />
                                <p className="text-xs text-slate-500">Separate names with commas</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fundingPartners">Funding Partners</Label>
                                <Input
                                    id="fundingPartners"
                                    name="fundingPartners"
                                    value={form.fundingPartners}
                                    onChange={handleChange}
                                    placeholder="e.g., African Development Bank, Green Climate Fund (comma separated)"
                                />
                                <p className="text-xs text-slate-500">Separate partners with commas</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Classification & Status */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-emerald-600" />
                                <CardTitle>Classification & Status</CardTitle>
                            </div>
                            <CardDescription>Organize and categorize your project</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tags" className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-slate-500" />
                                    Tags
                                </Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    value={form.tags}
                                    onChange={handleChange}
                                    placeholder="e.g., Training, Climate Finance, Sustainability"
                                />
                                <p className="text-xs text-slate-500">Separate tags with commas</p>

                                {tagArray.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 rounded-lg border">
                                        <span className="text-xs font-medium text-slate-600">Preview:</span>
                                        {tagArray.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
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
                                        <SelectItem value="Planning">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                                Planning
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Registration Open">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                Registration Open
                                            </div>
                                        </SelectItem>
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
                                    Create Project
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}