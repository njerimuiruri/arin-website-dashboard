"use client";
import { ArrowLeft, Edit, Calendar, FolderOpen, Tag, Clock, CheckCircle2, FileText, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ViewProjectDetailsPage() {
    // Simulating project data
    const project = {
        id: 'soar-2025',
        title: 'State of Adaptation Report, 2025 (SOAR,2025)',
        date: 'June 24, 2025',
        category: 'Climate Adaptation',
        excerpt: 'Africa stands at the frontline of the global climate crisis, confronting increasing risks across vital livelihood sectors, including agriculture, water, health, ecosystems, infrastructure, and human settlements.',
        tags: ['Climate Change', 'Adaptation', 'Policy'],
        status: 'Ongoing',
        description: `This comprehensive research initiative examines the state of climate adaptation across the African continent. The report analyzes current adaptation strategies, identifies gaps in implementation, and provides actionable recommendations for policymakers and stakeholders.

Key focus areas include:
• Agricultural resilience and food security
• Water resource management
• Public health infrastructure
• Ecosystem preservation
• Urban planning and infrastructure development
• Community-based adaptation strategies

The report draws from extensive field research, stakeholder consultations, and data analysis across multiple African nations, providing both regional overviews and country-specific insights.`,
        createdDate: 'January 15, 2025',
        lastUpdated: 'June 20, 2025',
        teamMembers: ['Dr. Amara Okonkwo', 'Prof. Kwame Asante', 'Dr. Fatima Hassan'],
        fundingSource: 'Global Climate Fund',
        budget: '$2.5M',
        duration: '18 months',
        collaborators: ['African Climate Policy Centre', 'Regional Universities Network', 'Local NGOs']
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Ongoing': return 'bg-green-100 text-green-800 border-green-300';
            case 'Completed': return 'bg-slate-100 text-slate-800 border-slate-300';
            case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default: return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                                <Badge className={`${getStatusColor(project.status)} border`}>
                                    {project.status}
                                </Badge>
                            </div>
                            <p className="text-slate-600 mt-1 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {project.date}
                                <span className="mx-1">•</span>
                                <FolderOpen className="h-4 w-4" />
                                {project.category}
                            </p>
                        </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Project
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <CardTitle>Project Overview</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                    {project.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-blue-600" />
                                    <CardTitle>Research Tags</CardTitle>
                                </div>
                                <CardDescription>Key topics and themes covered in this project</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-sm py-1.5 px-3">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Collaborators */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <CardTitle>Collaborating Organizations</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {project.collaborators.map((collab, index) => (
                                        <li key={index} className="flex items-center gap-2 text-slate-700">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            {collab}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Project Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Duration
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">{project.duration}</div>
                                </div>
                                <Separator />
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        Budget
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">{project.budget}</div>
                                </div>
                                <Separator />
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1">Funding Source</div>
                                    <div className="text-sm font-semibold text-slate-900">{project.fundingSource}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Members */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Team Members</CardTitle>
                                <CardDescription>Lead researchers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {project.teamMembers.map((member, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                                                {member.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{member}</div>
                                                <div className="text-xs text-slate-500">Researcher</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1">Created</div>
                                    <div className="text-sm text-slate-900">{project.createdDate}</div>
                                </div>
                                <Separator />
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1">Last Updated</div>
                                    <div className="text-sm text-slate-900">{project.lastUpdated}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6 space-y-2">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Project
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Download Report
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}