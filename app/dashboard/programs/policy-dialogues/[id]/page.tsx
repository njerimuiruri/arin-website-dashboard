"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Download, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPolicyDialogue, deletePolicyDialogue } from '@/services/policyDialoguesService';

export default function PolicyDialogueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [dialogue, setDialogue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await getPolicyDialogue(id);
                setDialogue(data);
            } catch (e: any) {
                setError(e?.message || 'Failed to load dialogue');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const formatDate = (val: any) => {
        const d = new Date(val);
        return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const buildImageUrl = (img?: string) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `https://api.demo.arin-africa.org${img}`;
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this policy dialogue?')) return;
        try {
            await deletePolicyDialogue(id);
            router.push('/dashboard/programs/policy-dialogues');
        } catch (e: any) {
            alert(e?.message || 'Failed to delete');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-slate-600">Loading policy dialogue details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !dialogue) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-red-600">{error || 'Dialogue not found'}</div>
                        <Button variant="outline" className="mt-4" onClick={() => router.push('/dashboard/programs/policy-dialogues')}>
                            Back to List
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const img = buildImageUrl(dialogue.image);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => router.push('/dashboard/programs/policy-dialogues')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dialogues
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.push(`/dashboard/programs/policy-dialogues/${id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Main Image */}
                {img && (
                    <Card className="overflow-hidden">
                        <div className="h-96 bg-slate-100">
                            <img src={img} alt={dialogue.title} className="w-full h-full object-cover" />
                        </div>
                    </Card>
                )}

                {/* Title and Status */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-3xl font-bold text-slate-900 mb-3">
                                    {dialogue.title}
                                </CardTitle>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(dialogue.date)}
                                    </div>
                                </div>
                            </div>
                            <Badge variant={dialogue.status === 'Ongoing' ? 'default' : 'secondary'} className={`text-base px-4 py-2 ${dialogue.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-800' : dialogue.status === 'Completed' ? 'bg-slate-100 text-slate-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {dialogue.status}
                            </Badge>
                        </div>
                    </CardHeader>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="prose prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: dialogue.description || '' }}
                        />
                    </CardContent>
                </Card>

                {/* Available Resources */}
                {dialogue.availableResources && dialogue.availableResources.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Available Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {dialogue.availableResources.map((resource: string, idx: number) => {
                                    const resourceUrl = resource.startsWith('http') ? resource : `https://api.demo.arin-africa.org${resource}`;
                                    const fileName = resource.split('/').pop() || `Resource ${idx + 1}`;
                                    return (
                                        <a
                                            key={idx}
                                            href={resourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            <Download className="h-5 w-5 text-emerald-600" />
                                            <span className="flex-1 text-sm font-medium">{fileName}</span>
                                            <Badge variant="outline">PDF</Badge>
                                        </a>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
