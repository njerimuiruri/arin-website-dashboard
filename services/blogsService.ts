
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.demo.arin-africa.org") + '/api';
const BASE_URL = `${API_BASE_URL}/blogs`;

export interface Blog {
  _id?: string;
  title: string;
  description: string;
  authors?: string[];
  image?: string;
  category?: string;
  date?: string;
  availableResources?: string[];
  projectTeam?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const blogsService = {
  async getAll(): Promise<Blog[]> {
    const response = await fetch(`${BASE_URL}`);
    if (!response.ok) throw new Error('Failed to fetch blogs');
    return response.json();
  },

  async getById(id: string): Promise<Blog> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Blog not found');
    return response.json();
  },

  async create(data: Blog): Promise<Blog> {
    const response = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create blog');
    return response.json();
  },

  async update(id: string, data: Blog): Promise<Blog> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update blog');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete blog');
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    const response = await fetch(`${BASE_URL}/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload resource');
    return response.json();
  },
};
