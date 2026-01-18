"use client";
import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useRouter } from 'next/navigation';

import { getResearchProjects } from '@/services/researchProjectService';

function ResearchProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // Get all unique statuses from projects
    const statuses = ['all', ...new Set(projects.map((p: any) => p.status))];

    useEffect(() => {
        setLoading(true);
        getResearchProjects()
            .then(data => setProjects(data))
            .catch(err => setError(err.message || 'Failed to load projects'))
            .finally(() => setLoading(false));
    }, []);

    const categories = ['all', ...new Set(projects.map((p: any) => p.category))];

    // Normalize projects to always have an id field (from _id if needed)
    const normalizedProjects = useMemo(() => {
        return projects.map((project) => ({
            ...project,
            id: project.id || project._id
        }));
    }, [projects]);

    // Filter projects based on search and filters
    const filteredProjects = useMemo(() => {
        return normalizedProjects.filter((project) => {
            const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            const matchesSearch =
                project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (project.tags && project.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
            return matchesCategory && matchesStatus && matchesSearch;
        });
    }, [normalizedProjects, categoryFilter, statusFilter, searchQuery]);

    const router = useRouter();
    const handleAddProject = () => {
        router.push("/dashboard/programs/research-projects/new");
    };

    const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') || '';
    const formatDate = (value: any) => {
        const d = new Date(value);
        return isNaN(d.getTime()) ? value : d.toLocaleDateString();
    };
    const buildImageUrl = (img?: string) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `http://localhost:5001${img}`;
    };
    const getText = (project: any) => stripHtml(project.description || project.excerpt || '');
    const getTeaser = (text: string, isExpanded: boolean, words = 12) => {
        if (isExpanded) return text;
        const parts = text.split(/\s+/).filter(Boolean);
        if (parts.length <= words) return text;
        return parts.slice(0, words).join(' ') + '…';
    };

    return (
        <div className="space-y-8">
            {/* Add Button */}
            <div className="flex justify-end">
                <Button className="flex items-center gap-2" variant="default" onClick={handleAddProject}>
                    <Plus className="h-5 w-5" />
                    Add Research Project
                </Button>
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
                                <SelectTrigger className="w-50">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={`cat-${cat}`} value={cat}>
                                            {cat === 'all' ? 'All Categories' : cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-45">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map(status => (
                                        <SelectItem key={`status-${status}`} value={status}>
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
                {filteredProjects.map((project: any, idx: number) => {
                    const id = project.id ? String(project.id) : `project-${idx}`;
                    const text = getText(project);
                    const isExpanded = expanded[id];
                    const teaser = getTeaser(text, isExpanded, 10);
                    const imageUrl = buildImageUrl(project.image);
                    const hasDate = Boolean(project.date);
                    const hasCategory = Boolean(project.category);

                    return (
                        <Card key={id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden">
                            {imageUrl ? (
                                <div className="relative h-40 w-full bg-slate-100">
                                    <img
                                        src={imageUrl}
                                        alt={project.title || 'Project image'}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-40 w-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                                    No image
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    {project.status && (
                                        <Badge variant={project.status === 'Ongoing' ? 'default' : 'secondary'} className={project.status === 'Ongoing' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                                            {project.status}
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-lg leading-tight text-slate-900">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs mt-2 flex-wrap">
                                    {hasDate ? (
                                        <>
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(project.date)}
                                        </>
                                    ) : (
                                        <span className="text-slate-400 italic">No date</span>
                                    )}
                                    <span className="mx-1">•</span>
                                    {hasCategory ? (
                                        <span>{project.category}</span>
                                    ) : (
                                        <span className="text-slate-400 italic">No category</span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-3">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {teaser}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags && project.tags.map((tag: string, idx: number) => (
                                        <Badge key={`${id}-${tag}-${idx}`} variant="outline" className="text-xs">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => {
                                        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
                                    }}
                                >
                                    {isExpanded ? 'View less' : 'View more'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => {
                                        if (project.id) {
                                            router.push(`/dashboard/programs/research-projects/${String(project.id)}`);
                                        } else {
                                            alert('Project ID is missing. Cannot view details.');
                                        }
                                    }}
                                >
                                    View Details →
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
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
    );
}
export default ResearchProjectsPage;