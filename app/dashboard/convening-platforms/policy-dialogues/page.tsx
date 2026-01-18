"use client";
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, Eye, Edit, Trash2 } from 'lucide-react';
import Link from "next/link";
import { getPolicyDialogues, deletePolicyDialogue } from '@/services/policyDialoguesService';

export default function PolicyDialoguesPage() {
    const router = useRouter();
    const [dialogues, setDialogues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('All');

    // Fetch dialogues
    useEffect(() => {
        async function fetch() {
            try {
                const data = await getPolicyDialogues();
                console.log('Fetched dialogues:', data);
                setDialogues(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load dialogues');
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    // Get unique years
    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(dialogues.map(d => new Date(d.date).getFullYear().toString()))).sort().reverse();
        return ['All', ...uniqueYears];
    }, [dialogues]);

    // Filter dialogues
    const filteredDialogues = useMemo(() => {
        return dialogues.filter(dialogue => {
            const matchesSearch = dialogue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dialogue.description.toLowerCase().includes(searchQuery.toLowerCase());
            const dialogueYear = new Date(dialogue.date).getFullYear().toString();
            const matchesYear = selectedYear === 'All' || dialogueYear === selectedYear;
            return matchesSearch && matchesYear;
        });
    }, [searchQuery, selectedYear, dialogues]);

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getExcerpt = (description: string) => {
        const text = description.replace(/<[^>]*>/g, '').substring(0, 100);
        return text.length < description.replace(/<[^>]*>/g, '').length ? text + '...' : text;
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this dialogue?')) return;
        try {
            await deletePolicyDialogue(id);
            setDialogues(dialogues.filter(d => d._id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Ongoing':
                return 'bg-green-100 text-green-800';
            case 'Completed':
                return 'bg-blue-100 text-blue-800';
            case 'Incomplete':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-yellow-900 mb-2">Policy Dialogues</h1>
                        <p className="text-yellow-700">Explore and manage policy dialogue events and workshops</p>
                    </div>
                    <Link href="/dashboard/convening-platforms/policy-dialogues/new">
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Dialogue
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400" />
                                <Input
                                    placeholder="Search dialogues by title or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:border-yellow-600 focus:outline-none"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="text-sm text-yellow-700">
                    Showing <span className="font-semibold text-yellow-900">{filteredDialogues.length}</span> of {dialogues.length} dialogues
                </div>

                {/* Loading State */}
                {loading && (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Loading policy dialogues...</p>
                        </CardContent>
                    </Card>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                            <p className="text-red-600">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Dialogues Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDialogues.map((dialogue) => (
                            <Card key={dialogue._id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant="default" className={getStatusColor(dialogue.status)}>
                                            {dialogue.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg leading-tight text-yellow-900">
                                        {dialogue.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-xs mt-2">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(dialogue.date)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {getExcerpt(dialogue.description)}
                                    </p>
                                </CardContent>
                                <CardContent className="pt-0 pb-4">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => router.push(`/dashboard/convening-platforms/policy-dialogues/${dialogue._id}`)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => router.push(`/dashboard/convening-platforms/policy-dialogues/${dialogue._id}/edit`)}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(dialogue._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredDialogues.length === 0 && (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-gray-600">No policy dialogues found. Create your first one!</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
