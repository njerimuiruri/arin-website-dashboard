"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contactService } from '@/services/contactService';
import { Mail, Phone, Calendar, Trash2, Check, Eye, User, FileText, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

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

interface PaginatedResponse {
    data: Contact[];
    total: number;
    page: number;
    pages: number;
}

const ITEMS_PER_PAGE = 10;

export default function ContactsPage() {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalContacts, setTotalContacts] = useState(0);

    useEffect(() => {
        fetchContacts(currentPage);
    }, [currentPage]);

    const fetchContacts = async (page: number) => {
        try {
            setLoading(true);
            const data: PaginatedResponse = await contactService.getAllContactsPaginated(
                page,
                ITEMS_PER_PAGE
            );

            setContacts(data.data);
            setTotalPages(data.pages);
            setTotalContacts(data.total);
            setCurrentPage(data.page);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            alert('Failed to load contacts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await contactService.markAsRead(id);

            // Update local state
            setContacts(contacts.map(contact =>
                contact._id === id ? { ...contact, isRead: true } : contact
            ));

            if (selectedContact?._id === id) {
                setSelectedContact({ ...selectedContact, isRead: true });
            }
        } catch (error) {
            console.error('Error marking as read:', error);
            alert('Failed to mark as read');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this contact message?')) {
            return;
        }

        try {
            await contactService.deleteContact(id);

            if (selectedContact?._id === id) {
                setSelectedContact(null);
            }

            // Refetch contacts for current page
            fetchContacts(currentPage);
            alert('Contact deleted successfully');
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Failed to delete contact');
        }
    };

    const handleContactClick = async (contact: Contact) => {
        // Navigate to the contact detail page
        router.push(`/dashboard/contacts/${contact._id}`);
    };

    const filteredContacts = contacts.filter(contact => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !contact.isRead;
        if (filter === 'read') return contact.isRead;
        return true;
    });

    const unreadCount = contacts.filter(c => !c.isRead).length;

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#021d49] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading contacts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                    <p className="text-gray-600 mt-1">
                        {totalContacts} total messages
                        {unreadCount > 0 && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                                {unreadCount} unread
                            </span>
                        )}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Page {currentPage} of {totalPages}
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                            ? 'bg-[#021d49] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({totalContacts})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                            ? 'bg-[#021d49] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Unread ({unreadCount})
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'read'
                            ? 'bg-[#021d49] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Read ({totalContacts - unreadCount})
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div>
                {/* Contact List */}
                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {filteredContacts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No messages found</p>
                        </div>
                    ) : (
                        filteredContacts.map((contact) => (
                            <div
                                key={contact._id}
                                onClick={() => handleContactClick(contact)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${contact.isRead
                                    ? 'bg-white border-gray-200 hover:border-[#021d49] hover:bg-gray-50'
                                    : 'bg-blue-50 border-blue-200 hover:border-blue-300 hover:bg-blue-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 flex-1">
                                        <User className="w-4 h-4 text-gray-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-semibold truncate ${!contact.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {contact.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                        {!contact.isRead && (
                                            <span className="w-2 h-2 bg-blue-600 rounded-full shrink-0"></span>
                                        )}
                                        <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 font-medium">{contact.subject}</p>
                                <p className="text-sm text-gray-500 truncate">{contact.message}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(contact.submittedAt || contact.createdAt || new Date()).toLocaleDateString()}
                                    </span>
                                    {contact.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {contact.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    {currentPage} / {totalPages}
                                </p>
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
