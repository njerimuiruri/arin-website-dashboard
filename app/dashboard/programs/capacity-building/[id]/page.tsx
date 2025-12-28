"use client";
import { ArrowLeft, Edit, Calendar, MapPin, Users, Clock, Tag, FileText, TrendingUp, Target, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

export default function ViewCapacityBuildingDetailsPage() {
    const project = {
        id: 'cfs-centre',
        title: 'The Climate Finance and Sustainability CFS (Centre)',
        date: 'October 3, 2023',
        status: 'Ongoing',
        location: 'Pan-African',
        duration: 'Ongoing',
        participants: '1000+ professionals',
        excerpt: 'The Climate Finance and Sustainability (CFS) Centre is one of the first Southern-Driven Centres of Excellence, aimed at enhancing climate finance and sustainability training in Africa.',
        tags: ['Training', 'Climate Finance', 'Sustainability'],
        description: `The Climate Finance and Sustainability (CFS) Centre represents a groundbreaking initiative in African-led capacity development. As one of the first Southern-Driven Centres of Excellence, it addresses the critical need for enhanced climate finance expertise and sustainability training across the continent.

The Centre operates with a comprehensive approach to capacity building:

Training Programs:
• Professional certification courses in climate finance
• Sustainability leadership development
• Policy analysis and advocacy training
• Project management for climate initiatives
• Financial mechanisms and green investment strategies

Target Audience:
• Government officials and policymakers
• Financial sector professionals
• NGO and civil society leaders
• Academic researchers and students
• Private sector sustainability officers

Impact Objectives:
The Centre aims to build a robust network of climate finance professionals who can effectively mobilize resources, design innovative financial instruments, and drive sustainable development initiatives across Africa. By fostering South-South learning and collaboration, the CFS Centre contributes to strengthening Africa's voice in global climate finance negotiations.`,
        createdDate: 'September 1, 2023',
        lastUpdated: 'December 20, 2024',
        facilitators: ['Dr. Amina Mohamed', 'Prof. Kwabena Osei', 'Dr. Zainab Ibrahim'],
        fundingPartners: ['African Development Bank', 'Green Climate Fund', 'European Union'],
        budget: '$5.2M',
        trainingModules: 12,
        certificationRate: 85,
        enrollmentProgress: 78,
        keyAchievements: [
            'Trained 1000+ professionals across 35 African countries',
            'Developed 12 specialized training modules',
            'Established partnerships with 20+ universities',
            'Published 8 research papers on African climate finance'
        ]
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Ongoing': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
            case 'Completed': return 'bg-slate-100 text-slate-800 border-slate-300';
            case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Registration Open': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
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
                            <p className="text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {project.date}
                                </span>
                                <span className="mx-1">•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {project.location}
                                </span>
                                <span className="mx-1">•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {project.duration}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
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
                                    <FileText className="h-5 w-5 text-emerald-600" />
                                    <CardTitle>Project Overview</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                    {project.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Key Achievements */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-emerald-600" />
                                    <CardTitle>Key Achievements</CardTitle>
                                </div>
                                <CardDescription>Milestones and accomplishments</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {project.keyAchievements.map((achievement, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Award className="h-3 w-3 text-emerald-600" />
                                            </div>
                                            <span className="text-slate-700">{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-emerald-600" />
                                    <CardTitle>Program Tags</CardTitle>
                                </div>
                                <CardDescription>Key focus areas and themes</CardDescription>
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

                        {/* Funding Partners */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                                    <CardTitle>Funding Partners</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {project.fundingPartners.map((partner, index) => (
                                        <li key={index} className="flex items-center gap-2 text-slate-700">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                            {partner}
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
                                <CardTitle className="text-lg">Program Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        Participants
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">{project.participants}</div>
                                </div>
                                <Separator />
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        Training Modules
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">{project.trainingModules} modules</div>
                                </div>
                                <Separator />
                                <div>
                                    <div className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        Budget
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">{project.budget}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Progress Tracking</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-slate-600">Enrollment</span>
                                        <span className="text-xs font-bold text-emerald-600">{project.enrollmentProgress}%</span>
                                    </div>
                                    <Progress value={project.enrollmentProgress} className="h-2" />
                                </div>
                                <Separator />
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-slate-600">Certification Rate</span>
                                        <span className="text-xs font-bold text-emerald-600">{project.certificationRate}%</span>
                                    </div>
                                    <Progress value={project.certificationRate} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Facilitators */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Lead Facilitators</CardTitle>
                                <CardDescription>Program coordinators</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {project.facilitators.map((facilitator, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                                                {facilitator.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{facilitator}</div>
                                                <div className="text-xs text-slate-500">Facilitator</div>
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
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Project
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Download Report
                                </Button>
                                <Button variant="outline" className="w-full">
                                    View Participants
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}