const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org') + '/api';

export interface TechnicalReport {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const technicalReportsService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/technical-reports/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/technical-reports/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: TechnicalReport): Promise<TechnicalReport> {
    const response = await fetch(`${API_BASE_URL}/technical-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create technical report');
    return response.json();
  },

  async getAll(): Promise<TechnicalReport[]> {
    const response = await fetch(`${API_BASE_URL}/technical-reports`);
    if (!response.ok) throw new Error('Failed to fetch technical reports');
    return response.json();
  },

  async getById(id: string): Promise<TechnicalReport> {
    const response = await fetch(`${API_BASE_URL}/technical-reports/${id}`);
    if (!response.ok) throw new Error('Technical report not found');
    return response.json();
  },

  async update(id: string, data: TechnicalReport): Promise<TechnicalReport> {
    const response = await fetch(`${API_BASE_URL}/technical-reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update technical report');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/technical-reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete technical report');
  },
};
