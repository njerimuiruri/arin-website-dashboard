"use client";
import { useState } from "react";
import { ArrowLeft, Save, FileText, Calendar, FolderOpen, Tag, Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function NewProjectPage() {
    const [form, setForm] = useState({
        title: "",
        date: "",
        category: "",
        excerpt: "",
        tags: "",
        status: "Ongoing"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (value) => {
        setForm({ ...form, status: value });
    };

    const handleSubmit = () => {
        // Here you would normally save the project
        console.log("Project created:", form);
        // router.push("/dashboard/programs/research-projects");
    };

    const tagArray = form.tags ? form.tags.split(',').map(t => t.trim()).filter(t => t) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Add New Project</h1>
                        <p className="text-slate-600 mt-1">Create a new research project entry</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <CardTitle>Basic Information</CardTitle>
                            </div>
                            <CardDescription>Enter the core details of your research project</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g., State of Adaptation Report, 2025"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                        Project Date *
                                    </Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        placeholder="e.g., June 24, 2025"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category" className="flex items-center gap-2">
                                        <FolderOpen className="h-4 w-4 text-slate-500" />
                                        Category *
                                    </Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        placeholder="e.g., Climate Adaptation"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt" className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-slate-500" />
                                    Project Description *
                                </Label>
                                <Textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={form.excerpt}
                                    onChange={handleChange}
                                    placeholder="Provide a brief description of the research project..."
                                    className="min-h-[120px] resize-none"
                                />
                                <p className="text-xs text-slate-500">{form.excerpt.length} characters</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Classification & Status */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Tag className="h-5 w-5 text-blue-600" />
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
                                    placeholder="e.g., Climate Change, Adaptation, Policy"
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
                                        <SelectItem value="Ongoing">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                Ongoing
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Completed">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-slate-500"></div>
                                                Completed
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Planning">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                                Planning
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="On Hold">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                                On Hold
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
                                <Button onClick={handleSubmit} className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700">
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