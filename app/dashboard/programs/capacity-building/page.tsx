"use client";
import { useState, useMemo } from 'react';
import { Search, Filter, Plus, Calendar, MapPin, Users, TrendingUp, CheckCircle2, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const projects = [
    {
        id: 'cfs-centre',
        title: 'The Climate Finance and Sustainability CFS (Centre)',
        date: 'October 3, 2023',
        status: 'Ongoing',
        location: 'Pan-African',
        duration: 'Ongoing',
        participants: '1000+ professionals',
        excerpt: 'The Climate Finance and Sustainability (CFS) Centre is one of the first Southern-Driven Centres of Excellence, aimed at enhancing climate finance and sustainability training in Africa.',
        tags: ['Training', 'Climate Finance', 'Sustainability']
    },
    {
        id: 'arin-ash-summer-school',
        title: 'Invitation to apply to the ARIN-ASH summer school',
        date: 'May 13, 2020',
        status: 'Completed',
        location: 'Africa',
        duration: '3 months',
        participants: '50+ scholars',
        excerpt: 'The Africa Sustainability Hub (ASH) is looking for young scholars willing to be part of a network of correspondents across and beyond Africa. The network shall purpose...',
        tags: ['Training', 'Programs', 'Youth Development']
    },
    {
        id: 'youth-climate-leaders',
        title: 'Youth Climate Leaders Program',
        date: 'January 15, 2024',
        status: 'Ongoing',
        location: 'East Africa',
        duration: '6 months',
        participants: '200+ youth',
        excerpt: 'Empowering young leaders across East Africa with climate action skills, policy knowledge, and community engagement strategies.',
        tags: ['Youth', 'Leadership', 'Climate Action']
    },
    {
        id: 'renewable-energy-training',
        title: 'Renewable Energy Technical Training',
        date: 'March 20, 2024',
        status: 'Ongoing',
        location: 'West Africa',
        duration: '12 months',
        participants: '500+ technicians',
        excerpt: 'Technical capacity building program focused on solar, wind, and hydroelectric power installation and maintenance.',
        tags: ['Energy', 'Technical Training', 'Renewable']
    }
];

export default function CapacityBuildingProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const locations = ['all', ...new Set(projects.map(p => p.location))];
    const statuses = ['all', ...new Set(projects.map(p => p.status))];

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesLocation = locationFilter === 'all' || project.location === locationFilter;
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

            return matchesSearch && matchesLocation && matchesStatus;
        });
    }, [searchQuery, locationFilter, statusFilter]);

    const ongoingCount = projects.filter(p => p.status === 'Ongoing').length;
    const completedCount = projects.filter(p => p.status === 'Completed').length;
    const totalParticipants = projects.reduce((acc, p) => {
        const num = parseInt(p.participants.replace(/\D/g, ''));
        return acc + (isNaN(num) ? 0 : num);
    }, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Capacity Building Projects</h1>
                        <p className="text-slate-600">Empowering communities through training and development</p>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Project
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-emerald-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Projects</CardTitle>
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{projects.length}</div>
                            <p className="text-xs text-slate-500 mt-1">Active training initiatives</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Ongoing Programs</CardTitle>
                            <Clock className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{ongoingCount}</div>
                            <p className="text-xs text-slate-500 mt-1">Currently running</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-teal-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Participants</CardTitle>
                            <Users className="h-5 w-5 text-teal-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{totalParticipants.toLocaleString()}+</div>
                            <p className="text-xs text-slate-500 mt-1">Professionals trained</p>
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
                                <Select value={locationFilter} onValueChange={setLocationFilter}>
                                    <SelectTrigger className="w-[200px]">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map(loc => (
                                            <SelectItem key={loc} value={loc}>
                                                {loc === 'all' ? 'All Locations' : loc}
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
                                    <Badge variant={project.status === 'Ongoing' ? 'default' : 'secondary'} className={project.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : ''}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight text-slate-900">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="space-y-1 text-xs mt-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        {project.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3" />
                                        {project.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        {project.duration}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-3 w-3" />
                                        {project.participants}
                                    </div>
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
                                <Button variant="ghost" className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
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