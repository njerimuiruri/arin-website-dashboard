const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api';

export interface Book {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  authors?: string[];
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const booksService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/books/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/books/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: Book): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create book');
    return response.json();
  },

  async getAll(): Promise<Book[]> {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  },

  async getById(id: string): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) throw new Error('Book not found');
    return response.json();
  },

  async update(id: string, data: Book): Promise<Book> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update book');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete book');
  },
};
