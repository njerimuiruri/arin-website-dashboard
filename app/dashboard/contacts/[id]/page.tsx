"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contactService } from '@/services/contactService';
import { Mail, Phone, Calendar, Trash2, Check, User, FileText, ArrowLeft } from 'lucide-react';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    isRead: boolean;
    submittedAt: string;
    createdAt?: string;
}

export default function ContactDetailPage() {
    const params = useParams();
    const router = useRouter();
    const contactId = params.id as string;

    const [contact, setContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchContact();
    }, [contactId]);

    const fetchContact = async () => {
        try {
            setLoading(true);
            const data = await contactService.getContactById(contactId);

            if (data) {
                setContact(data);

                // Mark as read when viewing
                if (!data.isRead) {
                    await handleMarkAsRead(data._id);
                }
            }
        } catch (error) {
            console.error('Error fetching contact:', error);
            alert('Failed to load contact message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await contactService.markAsRead(id);

            if (contact?._id === id) {
                setContact({ ...contact, isRead: true });
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this contact message?')) {
            return;
        }

        try {
            setDeleting(true);
            await contactService.deleteContact(contactId);
            alert('Contact deleted successfully');
            router.push('/dashboard/contacts');
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Failed to delete contact');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#46a1bb] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading message...</p>
                </div>
            </div>
        );
    }

    if (!contact) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">Contact message not found</p>
                    <button
                        onClick={() => router.push('/dashboard/contacts')}
                        className="px-4 py-2 bg-[#46a1bb] text-white rounded-lg hover:bg-[#3a8ba3]"
                    >
                        Back to Messages
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => router.push('/dashboard/contacts')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Messages
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    {/* Title and Status */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                {contact.subject}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span className="font-medium">{contact.name}</span>
                                {contact.isRead && (
                                    <span className="flex items-center gap-1 text-green-600 ml-4">
                                        <Check className="w-4 h-4" />
                                        <span className="font-medium">Read</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {!contact.isRead && (
                                <button
                                    onClick={() => handleMarkAsRead(contact._id)}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2 font-medium"
                                >
                                    <Check className="w-5 h-5" />
                                    Mark as Read
                                </button>
                            )}
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="w-5 h-5" />
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </label>
                            <a
                                href={`mailto:${contact.email}`}
                                className="text-lg text-[#46a1bb] hover:underline break-all"
                            >
                                {contact.email}
                            </a>
                        </div>

                        {contact.phone && (
                            <div>
                                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Phone Number
                                </label>
                                <a
                                    href={`tel:${contact.phone}`}
                                    className="text-lg text-[#46a1bb] hover:underline"
                                >
                                    {contact.phone}
                                </a>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4" />
                                Submitted Date
                            </label>
                            <p className="text-lg text-gray-700">
                                {new Date(contact.submittedAt || contact.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-4">
                            <FileText className="w-4 h-4" />
                            Message
                        </label>
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                                {contact.message}
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between">
                        <button
                            onClick={() => router.push('/dashboard/contacts')}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Back to Messages
                        </button>

                        {contact.email && (
                            <a
                                href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                                className="px-6 py-2 bg-[#46a1bb] text-white rounded-lg hover:bg-[#3a8ba3] transition-colors font-medium flex items-center gap-2"
                            >
                                <Mail className="w-5 h-5" />
                                Reply via Email
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
