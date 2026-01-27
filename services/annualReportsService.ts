const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001') + '/api';

export interface AnnualReport {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  year?: string;
  category?: string;
  availableResources?: string[];
}

export const annualReportsService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/annual-reports/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    const data = await response.json();
    // Ensure full URL if backend returns relative path
    if (data.url && !data.url.startsWith('http')) {
      data.url = `${API_BASE_URL}${data.url}`;
    }
    return data;
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/annual-reports/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload PDF resource');
    const data = await response.json();
    // Ensure full URL if backend returns relative path
    if (data.url && !data.url.startsWith('http')) {
      data.url = `${API_BASE_URL}${data.url}`;
    }
    return data;
  },

  async create(data: AnnualReport): Promise<AnnualReport> {
    const response = await fetch(`${API_BASE_URL}/annual-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create annual report');
    return response.json();
  },

  async getAll(): Promise<AnnualReport[]> {
    const response = await fetch(`${API_BASE_URL}/annual-reports`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch annual reports');
    const data = await response.json();
    // Fix image URLs to include base URL if relative
    return data.map((item: AnnualReport) => ({
      ...item,
      image: item.image && !item.image.startsWith('http') ? `${API_BASE_URL}${item.image}` : item.image,
      availableResources: item.availableResources?.map(url => 
        !url.startsWith('http') ? `${API_BASE_URL}${url}` : url
      ) || []
    }));
  },

  async getById(id: string): Promise<AnnualReport> {
    const response = await fetch(`${API_BASE_URL}/annual-reports/${id}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Annual report not found');
    const data = await response.json();
    // Fix image URLs to include base URL if relative
    return {
      ...data,
      image: data.image && !data.image.startsWith('http') ? `${API_BASE_URL}${data.image}` : data.image,
      availableResources: data.availableResources?.map((url: string) => 
        !url.startsWith('http') ? `${API_BASE_URL}${url}` : url
      ) || []
    };
  },

  async update(id: string, data: AnnualReport): Promise<AnnualReport> {
    const response = await fetch(`${API_BASE_URL}/annual-reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update annual report');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/annual-reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete annual report');
  },
};
