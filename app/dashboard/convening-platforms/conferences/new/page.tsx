"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { createConference, uploadConferenceImage, uploadConferenceResource, type Conference } from "@/services/conferencesService";

export default function NewConferencePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Conference>({
        title: '',
        description: '',
        image: '',
        venue: '',
        date: '',
        category: '',
        availableResources: [],
    });
    const [resourceInput, setResourceInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleAddResource = () => {
        if (resourceInput.trim()) {
            setFormData(prev => ({
                ...prev,
                availableResources: [...(prev.availableResources || []), resourceInput],
            }));
            setResourceInput('');
        }
    };

    const handleRemoveResource = (index: number) => {
        setFormData(prev => ({
            ...prev,
            availableResources: prev.availableResources?.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                imageUrl = await uploadConferenceImage(imageFile);
            }

            const dataToSend = {
                ...formData,
                image: imageUrl,
            };

            await createConference(dataToSend);
            alert('Conference created successfully!');
            router.push('/dashboard/convening-platforms/conferences');
        } catch (error) {
            console.error('Failed to create conference:', error);
            alert('Failed to create conference');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={20} /> Back
            </button>

            <h1 className="text-3xl font-bold mb-6">Create New Conference</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter conference title"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium mb-2">Date *</label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Venue */}
                <div>
                    <label className="block text-sm font-medium mb-2">Venue</label>
                    <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) => handleInputChange('venue', e.target.value)}
                        placeholder="Enter venue location"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="E.g., International Conference"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">Main Image</label>
                    <div className="border-2 border-dashed rounded-lg p-6">
                        {imagePreview ? (
                            <div className="flex gap-4 items-start">
                                <img src={imagePreview} alt="Preview" className="w-40 h-32 object-cover rounded" />
                                <div className="flex-1">
                                    <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800">
                                        <Upload size={18} />
                                        Change Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-800">
                                <Upload size={20} />
                                <div>
                                    <p className="font-medium">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-500">PNG, JPG, GIF (max 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Description with WYSIWYG */}
                <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <ImprovedTiptapEditor
                        value={formData.description}
                        onChange={(value) => handleInputChange('description', value)}
                    />
                </div>

                {/* Available Resources */}
                <div>
                    <label className="block text-sm font-medium mb-2">Available Resources (Optional)</label>
                    
                    {/* Upload PDF Option */}
                    <div className="mb-3">
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                            <FileText size={20} className="text-blue-600" />
                            <span className="text-sm">Upload PDF Resource</span>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            const url = await uploadConferenceResource(file);
                                            setFormData(prev => ({
                                                ...prev,
                                                availableResources: [...(prev.availableResources || []), url],
                                            }));
                                            alert('Resource uploaded successfully!');
                                        } catch (error) {
                                            console.error('Failed to upload resource:', error);
                                            alert('Failed to upload resource');
                                        }
                                    }
                                    e.target.value = '';
                                }}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Manual Text/URL Entry */}
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={resourceInput}
                            onChange={(e) => setResourceInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResource())}
                            placeholder="Or enter resource name or URL"
                            className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddResource}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                    {formData.availableResources && formData.availableResources.length > 0 && (
                        <div className="space-y-2">
                            {formData.availableResources.map((resource, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                    <span className="text-sm break-all">{resource}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveResource(index)}
                                        className="text-red-600 hover:text-red-800 ml-2"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Conference'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
