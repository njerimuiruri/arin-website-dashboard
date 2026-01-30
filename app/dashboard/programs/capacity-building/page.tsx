"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Calendar, MapPin, ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCapacityProjects, deleteCapacityProject } from '@/services/capacityBuildingService';

export default function CapacityBuildingProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        (async () => {
            try {
                const data = await getCapacityProjects();
                setProjects(data);
            } catch (e: any) {
                setError(e?.message || 'Failed to load projects');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const locations = useMemo(() => ['all', ...new Set(projects.map(p => p.location).filter(Boolean))], [projects]);
    const statuses = useMemo(() => ['all', ...new Set(projects.map(p => p.status).filter(Boolean))], [projects]);

    const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') || '';
    const teaser = (html: string, words = 12) => {
        const txt = stripHtml(html);
        const parts = txt.split(/\s+/).filter(Boolean);
        if (parts.length <= words) return txt;
        return parts.slice(0, words).join(' ') + '…';
    };
    const formatDate = (val: any) => {
        const d = new Date(val);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
    };
    const buildImageUrl = (img?: string) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `https://api.demo.arin-africa.org${img}`;
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = (project.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                stripHtml(project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLocation = locationFilter === 'all' || project.location === locationFilter;
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            return matchesSearch && matchesLocation && matchesStatus;
        });
    }, [projects, searchQuery, locationFilter, statusFilter]);

    const ongoingCount = projects.filter(p => p.status === 'Ongoing').length;
    const completedCount = projects.filter(p => p.status === 'Completed').length;

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this project?')) return;
        try {
            await deleteCapacityProject(id);
            setProjects(prev => prev.filter(p => (p.id || p._id) !== id));
        } catch (e: any) {
            alert(e?.message || 'Failed to delete');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Capacity Building Projects</h1>
                        <p className="text-slate-600">Empowering communities through training and development</p>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/dashboard/programs/capacity-building/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Project
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-emerald-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{projects.length}</div>
                            <p className="text-xs text-slate-500 mt-1">Training & capacity initiatives</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Ongoing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{ongoingCount}</div>
                            <p className="text-xs text-slate-500 mt-1">Currently running</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-teal-600">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{completedCount}</div>
                            <p className="text-xs text-slate-500 mt-1">Finished programs</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search projects by title or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-4">
                                <Select value={locationFilter} onValueChange={setLocationFilter}>
                                    <SelectTrigger className="w-[200px]">
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

                <div className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{filteredProjects.length}</span> of {projects.length} projects
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                        const id = project.id || project._id;
                        const img = buildImageUrl(project.image);
                        return (
                            <Card key={id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
                                {img ? (
                                    <div className="h-40 bg-slate-100">
                                        <img src={img} alt={project.title || 'image'} className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                                        <ImageIcon className="h-5 w-5 mr-2" /> No image
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant={project.status === 'Ongoing' ? 'default' : 'secondary'} className={project.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : ''}>
                                            {project.status || 'Unknown'}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg leading-tight text-slate-900">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="space-y-1 text-xs mt-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(project.date)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3 w-3" />
                                            {project.location || 'No location'}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {teaser(project.description || '')}
                                    </p>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/programs/capacity-building/${id}`)}>
                                        View
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/programs/capacity-building/${id}/edit`)}>
                                        Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(id)}>
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {filteredProjects.length === 0 && !loading && !error && (
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
