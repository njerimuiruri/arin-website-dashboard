"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { getPolicyDialogues, deletePolicyDialogue } from '@/services/policyDialoguesService';
import { PolicyDialogue } from '@/services/policyDialoguesService';

export default function PolicyDialoguesListPage() {
    const router = useRouter();
    const [dialogues, setDialogues] = useState<PolicyDialogue[]>([]);
    const [filteredDialogues, setFilteredDialogues] = useState<PolicyDialogue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    useEffect(() => {
        async function fetchDialogues() {
            try {
                const data = await getPolicyDialogues();
                setDialogues(data);
                setFilteredDialogues(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load policy dialogues');
            } finally {
                setLoading(false);
            }
        }
        fetchDialogues();
    }, []);

    useEffect(() => {
        let filtered = dialogues;

        if (searchQuery) {
            filtered = filtered.filter(d =>
                d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'All') {
            filtered = filtered.filter(d => d.status === statusFilter);
        }

        setFilteredDialogues(filtered);
    }, [searchQuery, statusFilter, dialogues]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this policy dialogue?')) return;
        try {
            await deletePolicyDialogue(id);
            setDialogues(dialogues.filter(d => d._id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete');
        }
    };

    const formatDate = (val: any) => {
        const d = new Date(val);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ongoing':
                return 'bg-emerald-100 text-emerald-800';
            case 'Completed':
                return 'bg-slate-100 text-slate-800';
            case 'Incomplete':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-slate-100 text-slate-800';
        }
    };

    const buildImageUrl = (img?: string) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `http://localhost:5001${img}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-slate-600">Loading policy dialogues...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Policy Dialogues</h1>
                        <p className="text-slate-600 mt-1">Manage policy dialogue sessions and documents</p>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/dashboard/programs/policy-dialogues/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Policy Dialogue
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-600">{dialogues.length}</div>
                                <div className="text-sm text-slate-600">Total Dialogues</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-600">{dialogues.filter(d => d.status === 'Ongoing').length}</div>
                                <div className="text-sm text-slate-600">Ongoing</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-600">{dialogues.filter(d => d.status === 'Completed').length}</div>
                                <div className="text-sm text-slate-600">Completed</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by title or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['All', 'Ongoing', 'Completed', 'Incomplete'].map(status => (
                                    <Button
                                        key={status}
                                        variant={statusFilter === status ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setStatusFilter(status)}
                                        className={statusFilter === status ? 'bg-emerald-600' : ''}
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Error */}
                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="text-red-600">{error}</div>
                        </CardContent>
                    </Card>
                )}

                {/* List */}
                {filteredDialogues.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <p className="text-slate-600">No policy dialogues found</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredDialogues.map(dialogue => {
                            const img = buildImageUrl(dialogue.image);
                            return (
                                <Card key={dialogue._id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {img && (
                                                <div className="md:w-48 h-40 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={img} alt={dialogue.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{dialogue.title}</h3>
                                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{dialogue.description}</p>
                                                        <div className="flex flex-wrap gap-2 items-center">
                                                            <Badge variant={dialogue.status === 'Ongoing' ? 'default' : 'secondary'} className={getStatusColor(dialogue.status)}>
                                                                {dialogue.status}
                                                            </Badge>
                                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(dialogue.date)}
                                                            </div>
                                                            {dialogue.availableResources && dialogue.availableResources.length > 0 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {dialogue.availableResources.length} resource{dialogue.availableResources.length > 1 ? 's' : ''}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/dashboard/programs/policy-dialogues/${dialogue._id}`)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/dashboard/programs/policy-dialogues/${dialogue._id}/edit`)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(dialogue._id!)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
