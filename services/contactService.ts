import { fetchWithAuth } from './authService';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api';

export const contactService = {
  async getAllContactsPaginated(page: number = 1, limit: number = 10) {
    const response = await fetchWithAuth(`${API_URL}/contacts?page=${page}&limit=${limit}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }

    return response.json();
  },

  async getAllContacts() {
    const response = await fetchWithAuth(`${API_URL}/contacts`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }

    return response.json();
  },

  async getUnreadCount() {
    const response = await fetchWithAuth(`${API_URL}/contacts/unread-count`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    return response.json();
  },

  async getContactById(id: string) {
    const response = await fetchWithAuth(`${API_URL}/contacts/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }

    return response.json();
  },

  async markAsRead(id: string) {
    const response = await fetchWithAuth(`${API_URL}/contacts/${id}/read`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to mark contact as read');
    }

    return response.json();
  },

  async deleteContact(id: string) {
    const response = await fetchWithAuth(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete contact');
    }

    return response.json();
  },
};
