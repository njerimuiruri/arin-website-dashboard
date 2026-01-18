const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface CallForBooks {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  deadline?: string;
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const callForBooksService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/call-for-books/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/call-for-books/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: CallForBooks): Promise<CallForBooks> {
    const response = await fetch(`${API_BASE_URL}/call-for-books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create call for books');
    return response.json();
  },

  async getAll(): Promise<CallForBooks[]> {
    const response = await fetch(`${API_BASE_URL}/call-for-books`);
    if (!response.ok) throw new Error('Failed to fetch call for books');
    return response.json();
  },

  async getById(id: string): Promise<CallForBooks> {
    const response = await fetch(`${API_BASE_URL}/call-for-books/${id}`);
    if (!response.ok) throw new Error('Call for books not found');
    return response.json();
  },

  async update(id: string, data: CallForBooks): Promise<CallForBooks> {
    const response = await fetch(`${API_BASE_URL}/call-for-books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update call for books');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/call-for-books/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete call for books');
  },
};
