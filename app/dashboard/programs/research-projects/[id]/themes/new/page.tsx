"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Info, Layers, BookOpen, Paperclip, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";
import ResourcesManager, { ResourceItem } from "@/components/research-projects/ResourcesManager";
import LearningModulesManager, { LearningModuleItem } from "@/components/research-projects/LearningModulesManager";
import TagListEditor from "@/components/research-projects/TagListEditor";
import KeyValueListManager from "@/components/research-projects/KeyValueListManager";
import SubProjectLevelsManager, { SubProjectLevelItem } from "@/components/research-projects/SubProjectLevelsManager";
import { createTheme } from "@/services/themeService";
import { uploadImage } from "@/services/researchProjectService";

export default function NewThemePage() {
    const params = useParams();
    const router = useRouter();
    const projectId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

    const [name, setName] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [overview, setOverview] = useState("");
    const [detailedContent, setDetailedContent] = useState("");
    const [externalUrl, setExternalUrl] = useState("");
    const [externalUrlLabel, setExternalUrlLabel] = useState("");
    const [objectives, setObjectives] = useState<string[]>([]);
    const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);
    const [stats, setStats] = useState<Record<string, string>[]>([]);
    const [format, setFormat] = useState<Record<string, string>[]>([]);
    const [levels, setLevels] = useState<SubProjectLevelItem[]>([]);
    const [learningModules, setLearningModules] = useState<LearningModuleItem[]>([]);
    const [resources, setResources] = useState<ResourceItem[]>([]);

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        try {
            setUploading(true);
            const res = await uploadImage(file);
            setCoverImage(res.url);
        } catch (err: any) {
            setError(err.message || "Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Give the project area a name.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await createTheme({
                researchProject: projectId,
                name: name.trim(),
                subtitle: subtitle.trim(),
                coverImage,
                overview,
                detailedContent,
                externalUrl: externalUrl.trim(),
                externalUrlLabel: externalUrlLabel.trim(),
                objectives,
                learningOutcomes,
                stats,
                format,
                levels,
                learningModules,
                resources,
            });
            router.push(`/dashboard/programs/research-projects/${projectId}/themes`);
        } catch (err: any) {
            setError(err.message || "Failed to create project area");
        } finally {
            setSaving(false);
        }
    };

    const imgPreviewSrc = coverImage
        ? coverImage.startsWith("http") ? coverImage : `https://api.demo.arin-africa.org${coverImage}`
        : null;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/60" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            New Project Area
                        </h1>
                        <p className="text-slate-600 mt-1">Give this project area its own page — overview, learning modules, and resources</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
                )}

                <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-linear-to-r from-amber-50 to-yellow-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-600 rounded-lg"><Layers className="h-5 w-5 text-white" /></div>
                            <div>
                                <CardTitle className="text-2xl">Project Area Details</CardTitle>
                                <CardDescription>Name and brief overview shown on the project area's page</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Project Area Name <span className="text-red-500">*</span></Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. AI for Climate Resilience"
                                className="h-12 border-2 focus:border-amber-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Subtitle</Label>
                            <Input
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder="Optional, e.g. In partnership with Taylor & Francis"
                                className="h-12 border-2 focus:border-amber-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Brief Overview</Label>
                            <Textarea
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                placeholder="A short description shown at the top of this project area's page"
                                className="border-2 focus:border-amber-500 min-h-24"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-600 rounded-lg"><ImagePlus className="h-5 w-5 text-white" /></div>
                            <div>
                                <CardTitle className="text-2xl">Cover Image</CardTitle>
                                <CardDescription>Optional — shown on the project area's card and page header</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="h-12 border-2 focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
                        {imgPreviewSrc && !uploading && (
                            <img src={imgPreviewSrc} alt="Preview" className="w-full max-w-md h-auto rounded-lg shadow-md" />
                        )}
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-linear-to-r from-indigo-50 to-purple-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-lg"><Info className="h-5 w-5 text-white" /></div>
                            <div>
                                <CardTitle className="text-2xl">View More Details</CardTitle>
                                <CardDescription>Richer content shown behind an expandable "View More Details" section on the project area's page</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ImprovedTiptapEditor
                            value={detailedContent}
                            onChange={setDetailedContent}
                            placeholder="Optional — add background, methodology, or other in-depth detail..."
                            uploadUrl="https://api.demo.arin-africa.org/api/research-projects/upload-description-image"
                            uploadFieldName="image"
                        />
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-linear-to-r from-amber-50 to-orange-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-600 rounded-lg"><GraduationCap className="h-5 w-5 text-white" /></div>
                            <div>
                                <CardTitle className="text-2xl">Programme / Fellowship Details</CardTitle>
                                <CardDescription>Optional — only for structured programmes (e.g. a fellowship with levels, certificates, and learning outcomes). Leave blank for a simple project area.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">External platform link</Label>
                                <Input
                                    value={externalUrl}
                                    onChange={(e) => setExternalUrl(e.target.value)}
                                    placeholder="https://elearning.arin-africa.org/ai-climate-resilience"
                                    className="h-11 border-2 focus:border-amber-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Link button label</Label>
                                <Input
                                    value={externalUrlLabel}
                                    onChange={(e) => setExternalUrlLabel(e.target.value)}
                                    placeholder="e.g. Go to the e-learning platform"
                                    className="h-11 border-2 focus:border-amber-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Objectives</Label>
                            <TagListEditor items={objectives} onChange={setObjectives} placeholder="Type an objective and press Enter" />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Headline stats</Label>
                            <p className="text-xs text-slate-500">e.g. Levels / 3, Pass Mark / 70%, Certificates / 3</p>
                            <KeyValueListManager
                                items={stats}
                                onChange={setStats}
                                fields={[
                                    { name: "label", label: "Label", placeholder: "Label, e.g. Pass Mark" },
                                    { name: "value", label: "Value", placeholder: "Value, e.g. 70%" },
                                ]}
                                addLabel="Add a stat"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Programme structure (levels)</Label>
                            <SubProjectLevelsManager items={levels} onChange={setLevels} />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Mode of study</Label>
                            <KeyValueListManager
                                items={format}
                                onChange={setFormat}
                                fields={[
                                    { name: "title", label: "Title", placeholder: "Title, e.g. Live Zoom Masterclasses" },
                                    { name: "description", label: "Description", placeholder: "Description (optional)", multiline: true, required: false },
                                ]}
                                addLabel="Add a mode of study"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Learning outcomes</Label>
                            <TagListEditor items={learningOutcomes} onChange={setLearningOutcomes} placeholder="Type a learning outcome and press Enter" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-linear-to-r from-emerald-50 to-lime-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-600 rounded-lg"><BookOpen className="h-5 w-5 text-white" /></div>
                            <div>
                                <CardTitle className="text-2xl">Learning Modules</CardTitle>
                                <CardDescription>Readings, videos, courses, or tools related to this project area</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <LearningModulesManager items={learningModules} onChange={setLearningModules} />
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-lg">
                    <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg"><Paperclip className="h-5 w-5 text-white" /></div>
                            <div>
                                <CardTitle className="text-2xl">Resources</CardTitle>
                                <CardDescription>PDFs, reports, presentations, toolkits and other files specific to this project area</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ResourcesManager items={resources} onChange={setResources} hideGroupField />
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <Link href={`/dashboard/programs/research-projects/${projectId}/themes`}>
                                <Button type="button" variant="outline" className="sm:w-auto w-full h-12 border-2">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                onClick={handleSubmit}
                                disabled={saving || uploading}
                                className="sm:w-auto w-full h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg font-semibold shadow-lg"
                            >
                                {saving ? "Creating..." : "Create Project Area"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
