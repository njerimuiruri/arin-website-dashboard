const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org') + '/api';

export interface Newsletter {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const newslettersService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/newsletters/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/newsletters/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: Newsletter): Promise<Newsletter> {
    const response = await fetch(`${API_BASE_URL}/newsletters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create newsletter');
    return response.json();
  },

  async getAll(): Promise<Newsletter[]> {
    const response = await fetch(`${API_BASE_URL}/newsletters`);
    if (!response.ok) throw new Error('Failed to fetch newsletters');
    return response.json();
  },

  async getById(id: string): Promise<Newsletter> {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`);
    if (!response.ok) throw new Error('Newsletter not found');
    return response.json();
  },

  async update(id: string, data: Newsletter): Promise<Newsletter> {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update newsletter');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete newsletter');
  },
};
