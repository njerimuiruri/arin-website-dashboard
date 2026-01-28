"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, FileText, Calendar as CalendarIcon } from 'lucide-react';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import SimpleCalendar from '@/components/SimpleCalendar';
import { getEvent, updateEvent, uploadEventImage, uploadEventResource } from '@/services/eventsService';

const EditEventPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        category: '',
        status: 'Upcoming',
        description: '',
        image: '',
        availableResources: [] as string[],
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [resourceFiles, setResourceFiles] = useState<File[]>([]);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const event = await getEvent(id);
                if (event) {
                    setFormData({
                        title: event.title || '',
                        date: event.date ? event.date.split('T')[0] : '',
                        time: event.time || '',
                        location: event.location || '',
                        category: event.category || '',
                        status: event.status || 'Upcoming',
                        description: event.description || '',
                        image: event.image || '',
                        availableResources: event.availableResources || [],
                    });
                    if (event.image) {
                        const imgUrl = event.image.startsWith('http') ? event.image : `http://localhost:5001${event.image}`;
                        setImagePreview(imgUrl);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch event:', error);
                alert('Failed to load event data');
            } finally {
                setFetchLoading(false);
            }
        }
        if (id) {
            fetchEvent();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (html: string) => {
        setFormData(prev => ({ ...prev, description: html }));
    };

    const handleDateSelect = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;
        setFormData(prev => ({ ...prev, date: formatted }));
        setShowCalendar(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setResourceFiles(prev => [...prev, ...Array.from(files)]);
        }
    };

    const removeResource = (index: number) => {
        setResourceFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingResource = (index: number) => {
        setFormData(prev => ({
            ...prev,
            availableResources: prev.availableResources.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imagePath = formData.image;
            if (imageFile) {
                imagePath = await uploadEventImage(imageFile);
            }

            const resourcePaths: string[] = [...formData.availableResources];
            for (const file of resourceFiles) {
                const path = await uploadEventResource(file);
                resourcePaths.push(path);
            }

            const eventData = {
                ...formData,
                image: imagePath,
                availableResources: resourcePaths,
            };

            await updateEvent(id, eventData);
            alert('Event updated successfully!');
            router.push('/dashboard/convening-platforms/events');
        } catch (error) {
            console.error('Failed to update event:', error);
            alert('Failed to update event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#021d49] border-t-transparent mx-auto"></div>
                    <p className="text-gray-600 mt-4 font-medium">Loading event data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => router.push('/dashboard/convening-platforms/events')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Events
                </button>

                <Card className="shadow-xl border-0">
                    <CardHeader className="bg-gradient-to-r from-[#021d49] to-[#021d49] text-white">
                        <CardTitle className="text-2xl">Edit Event</CardTitle>
                        <CardDescription className="text-gray-100">
                            Update event details, category, and resources
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <Label htmlFor="title" className="text-base font-semibold">
                                    Event Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter event title"
                                    required
                                    className="mt-2"
                                />
                            </div>

                            {/* Date and Time Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Date */}
                                <div>
                                    <Label htmlFor="date" className="text-base font-semibold">
                                        Event Date <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-2">
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowCalendar(!showCalendar)}
                                            className="mt-2 w-full"
                                        >
                                            <CalendarIcon className="w-4 h-4 mr-2" />
                                            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
                                        </Button>
                                        {showCalendar && (
                                            <div className="mt-2 border rounded-lg p-4 bg-white shadow-lg">
                                                <SimpleCalendar
                                                    selectedDate={formData.date ? new Date(formData.date) : new Date()}
                                                    onDateSelect={handleDateSelect}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Time */}
                                <div>
                                    <Label htmlFor="time" className="text-base font-semibold">
                                        Event Time <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="time"
                                        name="time"
                                        type="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <Label htmlFor="location" className="text-base font-semibold">
                                    Location <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Enter event location"
                                    required
                                    className="mt-2"
                                />
                            </div>

                            {/* Category and Status Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div>
                                    <Label htmlFor="category" className="text-base font-semibold">
                                        Category <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleSelectChange('category', value)}
                                        required
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Conference">Conference</SelectItem>
                                            <SelectItem value="Workshop">Workshop</SelectItem>
                                            <SelectItem value="Webinar">Webinar</SelectItem>
                                            <SelectItem value="Dialogue">Dialogue</SelectItem>
                                            <SelectItem value="Friday Reviews">Friday Reviews</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div>
                                    <Label htmlFor="status" className="text-base font-semibold">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange('status', value)}
                                        required
                                    >
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                                            <SelectItem value="Past">Past</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="text-base font-semibold">
                                    Event Description <span className="text-red-500">*</span>
                                </Label>
                                <div className="mt-2 border rounded-lg overflow-hidden">
                                    <ImprovedTiptapEditor
                                        value={formData.description}
                                        onChange={handleDescriptionChange}
                                        uploadUrl="http://localhost:5001/events/upload"
                                        uploadFieldName="image"
                                    />
                                </div>
                            </div>

                            {/* Main Image Upload */}
                            <div>
                                <Label className="text-base font-semibold">Main Event Image</Label>
                                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#021d49] transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Click to upload new event image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </label>
                                </div>
                                {imagePreview && (
                                    <div className="mt-4 relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-64 rounded-lg mx-auto border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview('');
                                                setFormData(prev => ({ ...prev, image: '' }));
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Existing Resources */}
                            {formData.availableResources.length > 0 && (
                                <div>
                                    <Label className="text-base font-semibold">Existing Resources</Label>
                                    <div className="mt-2 space-y-2">
                                        {formData.availableResources.map((resource, index) => {
                                            const fileName = resource.split('/').pop() || `Resource ${index + 1}`;
                                            return (
                                                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-blue-600" />
                                                        <span className="text-sm text-gray-700">{fileName}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingResource(index)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* New Resources Upload */}
                            <div>
                                <Label className="text-base font-semibold">Add New Resources (PDFs)</Label>
                                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#021d49] transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        multiple
                                        onChange={handleResourceChange}
                                        className="hidden"
                                        id="resource-upload"
                                    />
                                    <label htmlFor="resource-upload" className="cursor-pointer">
                                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Click to upload PDF resources</p>
                                        <p className="text-xs text-gray-400 mt-1">Multiple PDFs allowed, up to 10MB each</p>
                                    </label>
                                </div>
                                {resourceFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {resourceFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-5 h-5 text-green-600" />
                                                    <span className="text-sm text-gray-700">{file.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeResource(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-[#021d49] to-[#021d49] hover:opacity-90 text-white"
                                >
                                    {loading ? 'Updating...' : 'Update Event'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/dashboard/convening-platforms/events')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EditEventPage;
