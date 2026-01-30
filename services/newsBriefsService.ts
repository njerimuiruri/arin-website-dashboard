const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org') + '/api';

export interface NewsBrief {
  _id?: string;
  title: string;
  description: string;
  authors?: string[];
  image?: string;
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const newsBriefsService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/news-briefs/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/news-briefs/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: NewsBrief): Promise<NewsBrief> {
    const response = await fetch(`${API_BASE_URL}/news-briefs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create news brief');
    return response.json();
  },

  async getAll(): Promise<NewsBrief[]> {
    const response = await fetch(`${API_BASE_URL}/news-briefs`);
    if (!response.ok) throw new Error('Failed to fetch news briefs');
    return response.json();
  },

  async getById(id: string): Promise<NewsBrief> {
    const response = await fetch(`${API_BASE_URL}/news-briefs/${id}`);
    if (!response.ok) throw new Error('News brief not found');
    return response.json();
  },

  async update(id: string, data: NewsBrief): Promise<NewsBrief> {
    const response = await fetch(`${API_BASE_URL}/news-briefs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update news brief');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/news-briefs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete news brief');
  },
};
