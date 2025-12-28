"use client";
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, Tag } from 'lucide-react';
import Link from "next/link";

const dialogues = [
    {
        id: 'community-leaders-drr',
        title: 'Community Leaders Dialogues on Disaster Risk Reduction (DRR) and Gender Intersectionality under the Nairobi City Risk Hub, 2020',
        date: 'December 10, 2020',
        year: '2020',
        excerpt: 'The Nairobi Risk Hub Secretariat (African Centre for Technology Studies -ACTS), Nairobi City County Government…',
        tags: ['DRR', 'Gender', 'Urban Risk'],
        status: 'Completed'
    },
    {
        id: 'climate-finance-ndcs',
        title: 'Making Climate Finance Work for Africa: Using NDCs to Leverage Climate Finance for Innovation System Building',
        date: 'August 10, 2020',
        year: '2020',
        excerpt: 'The workshop was organized by the Africa Sustainability Hub (ASH), a networked research and knowledge…',
        tags: ['Climate Finance', 'NDCs', 'Innovation'],
        status: 'Completed'
    }
];

export default function PolicyDialoguesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredDialogues = useMemo(() => {
        return dialogues.filter(dialogue => {
            const matchesSearch = dialogue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dialogue.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dialogue.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
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

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400" />
                                <Input
                                    placeholder="Search dialogues by title, description, or tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="text-sm text-yellow-700">
                    Showing <span className="font-semibold text-yellow-900">{filteredDialogues.length}</span> of {dialogues.length} dialogues
                </div>

                {/* Dialogues Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDialogues.map((dialogue) => (
                        <Card key={dialogue.id} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between mb-2">
                                    <Badge variant={dialogue.status === 'Completed' ? 'default' : 'secondary'} className={dialogue.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                                        {dialogue.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg leading-tight text-yellow-900">
                                    {dialogue.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs mt-2">
                                    <Calendar className="h-3 w-3" />
                                    {dialogue.date}
                                    <span className="mx-1">•</span>
                                    {dialogue.year}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-yellow-700 line-clamp-3">{dialogue.excerpt}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {dialogue.tags.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/dashboard/convening-platforms/policy-dialogues/${dialogue.id}`} className="w-full">
                                    <Button variant="ghost" className="w-full text-yellow-700 hover:text-yellow-900 hover:bg-yellow-50">
                                        View Details →
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {filteredDialogues.length === 0 && (
                    <Card className="p-12">
                        <div className="text-center">
                            <Search className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">No dialogues found</h3>
                            <p className="text-yellow-700">Try adjusting your search</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
