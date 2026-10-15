"use client";
import { FolderOpen, Activity, CalendarCheck } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Must match the focus areas on the website (About Us → Focus Areas); the
// website groups the Research Projects menu by these exact names.
export const FOCUS_AREAS = [
    'Sustainable Development',
    'Climate Change & Energy',
    'Cities & Resilience',
    'Agriculture & Forestry',
    'Mining, Trade & Industry',
    'Technology & Innovation',
    'Climate and Health',
    'Forests & Ecosystems',
];

export type ProjectStatus = '' | 'ongoing' | 'completed';

interface Props {
    category: string;
    status: ProjectStatus;
    endYear: string;
    onChange: (field: 'category' | 'status' | 'endYear', value: string) => void;
}

export default function ProjectClassificationFields({ category, status, endYear, onChange }: Props) {
    const selectClass = "w-full h-12 border-2 focus:border-blue-500 transition-all rounded-md px-3";
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    Focus Area
                </Label>
                <select
                    id="category"
                    value={FOCUS_AREAS.includes(category) ? category : ''}
                    onChange={(e) => onChange('category', e.target.value)}
                    className={selectClass}
                >
                    <option value="">Select focus area</option>
                    {FOCUS_AREAS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                {category && !FOCUS_AREAS.includes(category) && (
                    <p className="text-xs text-amber-600">Old category &quot;{category}&quot;: please pick a focus area.</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status" className="text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Status
                </Label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => onChange('status', e.target.value)}
                    className={selectClass}
                >
                    <option value="">Not specified</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="endYear" className="text-base font-semibold flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-blue-600" />
                    End Year (optional)
                </Label>
                <Input
                    id="endYear"
                    type="number"
                    min={1990}
                    max={2100}
                    value={endYear}
                    onChange={(e) => onChange('endYear', e.target.value)}
                    placeholder="e.g. 2027"
                    className="h-12 border-2 focus:border-blue-500 transition-all"
                />
            </div>
        </div>
    );
}
