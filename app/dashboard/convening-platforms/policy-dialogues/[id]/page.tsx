"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Download } from "lucide-react";
import { getPolicyDialogue, deletePolicyDialogue } from "@/services/policyDialoguesService";

// Simple Calendar Component
const SimpleCalendar = ({ dateString }: { dateString: string }) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return (
        <div className="bg-white rounded-lg border border-yellow-200 p-4 max-w-sm">
            <h3 className="text-center font-semibold text-yellow-900 mb-4">{monthName}</h3>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-600 py-2">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((d, idx) => (
                    <div
                        key={idx}
                        className={`aspect-square flex items-center justify-center text-sm rounded ${d === null
                            ? 'bg-gray-50'
                            : d === day
                                ? 'bg-yellow-600 text-white font-bold'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                    >
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function DialogueDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [dialogue, setDialogue] = useState<import("@/services/policyDialoguesService").PolicyDialogue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDialogue = async () => {
            try {
                const data = await getPolicyDialogue(id);
                if (!data) {
                    setError("Dialogue not found");
                    return;
                }
                setDialogue(data);
            } catch (err) {
                setError("Failed to load dialogue");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDialogue();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this dialogue?")) return;

        try {
            await deletePolicyDialogue(id);
            router.push("/dashboard/convening-platforms/policy-dialogues");
        } catch (err) {
            setError("Failed to delete dialogue");
            console.error(err);
        }
    };

    const buildImageUrl = (path: string) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `https://api.demo.arin-africa.org${path}`;
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error || !dialogue) return (
        <div className="p-8">
            <Alert variant="destructive">
                <AlertDescription>{error || "Dialogue not found"}</AlertDescription>
            </Alert>
        </div>
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-yellow-50 via-white to-blue-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.push("/dashboard/convening-platforms/policy-dialogues")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-bold text-yellow-900">Dialogue Details</h1>
                </div>

                {/* Main Content */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-linear-to-r from-yellow-50 to-blue-50 border-b">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <CardTitle className="text-2xl text-yellow-900">{dialogue.title}</CardTitle>
                                    <CardDescription className="text-base mt-2">{dialogue.date}</CardDescription>
                                </div>
                                <Badge variant={dialogue.status === 'Completed' ? 'default' : dialogue.status === 'Ongoing' ? 'secondary' : 'outline'}>
                                    {dialogue.status}
                                </Badge>
                            </div>
                            {/* Calendar */}
                            <div className="mt-4">
                                <SimpleCalendar dateString={dialogue.date} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Image */}
                        {dialogue.image && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-yellow-900">Dialogue Image</h3>
                                <div className="relative h-96 rounded-lg overflow-hidden border">
                                    <img src={buildImageUrl(dialogue.image)} alt={dialogue.title} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {dialogue.description && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-yellow-900">Description</h3>
                                <div className="prose prose-sm max-w-none text-gray-700 p-4 bg-gray-50 rounded-lg" dangerouslySetInnerHTML={{ __html: dialogue.description }} />
                            </div>
                        )}

                        {/* Resources */}
                        {dialogue.availableResources && dialogue.availableResources.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-yellow-900 flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Available Resources
                                </h3>
                                <div className="space-y-2">
                                    {dialogue.availableResources.map((resource, idx) => {
                                        const fileName = resource.split('/').pop() || `Resource ${idx + 1}`;
                                        return (
                                            <a
                                                key={idx}
                                                href={buildImageUrl(resource)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition"
                                            >
                                                <Download className="h-4 w-4 text-yellow-600 shrink-0" />
                                                <span className="text-sm text-yellow-900">{fileName}</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <Button variant="outline" onClick={() => router.push(`/dashboard/convening-platforms/policy-dialogues/${id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
