"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';
import ImprovedTiptapEditor from '@/components/ImprovedTiptapEditor';
import { getVacancy, updateVacancy, uploadVacancyImage } from "@/services/vacanciesService";

const EditVacancyPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [formData, setFormData] = useState({
        positionName: '',
        employmentType: 'Full-time',
        description: '',
        datePosted: '',
        deadline: '',
        image: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        async function fetchVacancy() {
            if (!id) return;
            try {
                const data = await getVacancy(id);
                if (data) {
                    setFormData(data);
                    setImagePreview(data.image || '');
                }
            } catch (err) {
                console.error('Failed to fetch vacancy:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchVacancy();
    }, [id]);

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
        setSaving(true);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                imageUrl = await uploadVacancyImage(imageFile);
            }

            const dataToSend = {
                ...formData,
                image: imageUrl,
            };

            await updateVacancy(id, dataToSend);
            alert('Vacancy updated successfully!');
            router.push(`/dashboard/opportunities/vacancies/${id}`);
        } catch (error) {
            console.error('Failed to update vacancy:', error);
            alert('Failed to update vacancy');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-pulse">Loading vacancy...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800">
                <ArrowLeft size={20} /> Back
            </button>

            <h1 className="text-3xl font-bold mb-6">Edit Vacancy</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Position Name *</label>
                    <input
                        type="text"
                        value={formData.positionName}
                        onChange={(e) => handleInputChange('positionName', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

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

                <div>
                    <label className="block text-sm font-medium mb-2">Date Posted *</label>
                    <input
                        type="date"
                        value={formData.datePosted ? new Date(formData.datePosted).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('datePosted', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Deadline *</label>
                    <input
                        type="date"
                        value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

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
                                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
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
                                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <ImprovedTiptapEditor
                        value={formData.description}
                        onChange={(value) => handleInputChange('description', value)}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
                    >
                        {saving ? 'Updating...' : 'Update Vacancy'}
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
};

export default EditVacancyPage;
