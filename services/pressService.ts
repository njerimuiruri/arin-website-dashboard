const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api';

export interface Press {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const pressService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/press/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/press/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: Press): Promise<Press> {
    const response = await fetch(`${API_BASE_URL}/press`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create press item');
    return response.json();
  },

  async getAll(): Promise<Press[]> {
    const response = await fetch(`${API_BASE_URL}/press`);
    if (!response.ok) throw new Error('Failed to fetch press items');
    return response.json();
  },

  async getById(id: string): Promise<Press> {
    const response = await fetch(`${API_BASE_URL}/press/${id}`);
    if (!response.ok) throw new Error('Press item not found');
    return response.json();
  },

  async update(id: string, data: Press): Promise<Press> {
    const response = await fetch(`${API_BASE_URL}/press/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update press item');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/press/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete press item');
  },
};
