
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api';

export interface JournalArticle {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  authors?: string[];
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const journalArticlesService = {
  async uploadDescriptionImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_BASE_URL}/journal-articles/upload-description-image`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload description image');
    return response.json();
  },
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/journal-articles/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/journal-articles/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: JournalArticle): Promise<JournalArticle> {
    const response = await fetch(`${API_BASE_URL}/journal-articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create journal article');
    return response.json();
  },

  async getAll(): Promise<JournalArticle[]> {
    const response = await fetch(`${API_BASE_URL}/journal-articles`);
    if (!response.ok) throw new Error('Failed to fetch journal articles');
    return response.json();
  },

  async getById(id: string): Promise<JournalArticle> {
    const response = await fetch(`${API_BASE_URL}/journal-articles/${id}`);
    if (!response.ok) throw new Error('Journal article not found');
    return response.json();
  },

  async update(id: string, data: JournalArticle): Promise<JournalArticle> {
    const response = await fetch(`${API_BASE_URL}/journal-articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update journal article');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/journal-articles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete journal article');
  },
};
