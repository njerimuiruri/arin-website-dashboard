"use client";
import { useState, useMemo } from 'react';
import { Search, Filter, Plus, Calendar, Tag, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const projects = [
    {
        id: 'soar-2025',
        title: 'State of Adaptation Report, 2025 (SOAR,2025)',
        date: 'June 24, 2025',
        category: 'Climate Adaptation',
        excerpt: 'Africa stands at the frontline of the global climate crisis, confronting increasing risks across vital livelihood sectors, including agriculture, water, health, ecosystems, infrastructure, and human settlements.',
        tags: ['Climate Change', 'Adaptation', 'Policy'],
        status: 'Ongoing'
    },
    {
        id: 'just-transitions-africa',
        title: 'The Global Political Economy of Just Transitions for and in Africa',
        date: 'June 10, 2025',
        category: 'Economic Development',
        excerpt: 'The Project is a multi-country research initiative that seeks to explore how global and local political economy dynamics shape just transition pathways in Africa.',
        tags: ['Just Transition', 'Political Economy', 'Energy'],
        status: 'Ongoing'
    },
    {
        id: 'funding-loss-damage',
        title: 'Funding Loss and Damage in African LDCs: Challenges and Opportunities',
        date: 'February 3, 2025',
        category: 'Climate Finance',
        excerpt: 'The "Funding arrangements for loss and damage associated with slow onset climate impacts: an analysis of African Least Developed Countries" project examines financing mechanisms.',
        tags: ['Loss and Damage', 'Finance', 'LDCs'],
        status: 'Completed'
    },
    {
        id: 'ndc-finance-africa',
        title: 'Building capacity and mobilizing knowledge towards catalyzing NDC finance in Africa',
        date: 'January 15, 2025',
        category: 'Capacity Building',
        excerpt: 'This initiative focuses on strengthening African countries\' capacity to access and mobilize finance for implementing their Nationally Determined Contributions (NDCs).',
        tags: ['NDC', 'Finance', 'Capacity Building'],
        status: 'Ongoing'
    },
    {
        id: 'climate-justice',
        title: 'Climate Justice in African Policy',
        date: 'March 12, 2025',
        category: 'Policy',
        excerpt: 'Exploring the integration of climate justice principles into African policy frameworks and their impact on vulnerable communities.',
        tags: ['Climate Justice', 'Policy', 'Africa'],
        status: 'Ongoing'
    },
    {
        id: 'agri-adapt',
        title: 'Agricultural Adaptation Strategies in Sub-Saharan Africa',
        date: 'April 8, 2025',
        category: 'Agriculture',
        excerpt: 'A study on innovative adaptation strategies for agriculture in response to climate change in Sub-Saharan Africa.',
        tags: ['Agriculture', 'Adaptation', 'Innovation'],
        status: 'Ongoing'
    }
];

export default function ResearchProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const categories = ['all', ...new Set(projects.map(p => p.category))];
    const statuses = ['all', ...new Set(projects.map(p => p.status))];

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [searchQuery, categoryFilter, statusFilter]);

    const ongoingCount = projects.filter(p => p.status === 'Ongoing').length;
    const completedCount = projects.filter(p => p.status === 'Completed').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Research Projects</h1>
                        <p className="text-slate-600">Manage and explore ongoing climate research initiatives</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Project
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-blue-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Projects</CardTitle>
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{projects.length}</div>
                            <p className="text-xs text-slate-500 mt-1">Active research initiatives</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Ongoing</CardTitle>
                            <Clock className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{ongoingCount}</div>
                            <p className="text-xs text-slate-500 mt-1">Currently in progress</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-slate-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
                            <CheckCircle2 className="h-5 w-5 text-slate-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{completedCount}</div>
                            <p className="text-xs text-slate-500 mt-1">Successfully finished</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search projects by title, description, or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-4">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[200px]">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat === 'all' ? 'All Categories' : cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map(status => (
                                            <SelectItem key={status} value={status}>
                                                {status === 'all' ? 'All Statuses' : status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{filteredProjects.length}</span> of {projects.length} projects
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <Badge variant={project.status === 'Ongoing' ? 'default' : 'secondary'} className={project.status === 'Ongoing' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight text-slate-900">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs mt-2">
                                    <Calendar className="h-3 w-3" />
                                    {project.date}
                                    <span className="mx-1">•</span>
                                    {project.category}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-slate-600 line-clamp-3">{project.excerpt}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {project.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                    View Details →
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {filteredProjects.length === 0 && (
                    <Card className="p-12">
                        <div className="text-center">
                            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
                            <p className="text-slate-600">Try adjusting your search or filters</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}