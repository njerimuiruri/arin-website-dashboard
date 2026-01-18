"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from 'lucide-react';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { createVacancy, uploadVacancyImage } from "@/services/vacanciesService";

export default function NewVacancyPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        positionName: '',
        employmentType: 'Full-time',
        description: '',
        datePosted: '',
        deadline: '',
        image: '',
    });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                imageUrl = await uploadVacancyImage(imageFile);
            }

            const dataToSend = {
                ...formData,
                image: imageUrl,
            };

            await createVacancy(dataToSend);
            alert('Vacancy created successfully!');
            router.push('/dashboard/opportunities/vacancies');
        } catch (error) {
            console.error('Failed to create vacancy:', error);
            alert('Failed to create vacancy');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={20} /> Back
            </button>

            <h1 className="text-3xl font-bold mb-6">Create New Vacancy</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                {/* Position Name */}
                <div>
                    <label className="block text-sm font-medium mb-2">Position Name *</label>
                    <input
                        type="text"
                        value={formData.positionName}
                        onChange={(e) => handleInputChange('positionName', e.target.value)}
                        placeholder="Enter position name"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Employment Type */}
                <div>
                    <label className="block text-sm font-medium mb-2">Employment Type *</label>
                    <select
                        value={formData.employmentType}
                        onChange={(e) => handleInputChange('employmentType', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                    </select>
                </div>

                {/* Date Posted */}
                <div>
                    <label className="block text-sm font-medium mb-2">Date Posted *</label>
                    <input
                        type="date"
                        value={formData.datePosted}
                        onChange={(e) => handleInputChange('datePosted', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Deadline */}
                <div>
                    <label className="block text-sm font-medium mb-2">Application Deadline *</label>
                    <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">Image</label>
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

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Vacancy'}
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
