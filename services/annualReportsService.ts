const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org') + '/api';

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
    // Step 1: get signed upload params from the backend (fast, no file transfer)
    const sigRes = await fetch(`${API_BASE_URL}/annual-reports/sign-upload`);
    if (!sigRes.ok) throw new Error('Failed to get upload signature');
    const { signature, timestamp, api_key, cloud_name, folder, resource_type } = await sigRes.json();

    // Step 2: upload directly from the browser to Cloudinary (no backend involved)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('folder', folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/${resource_type}/upload`,
      { method: 'POST', body: formData }
    );
    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({}));
      throw new Error(err?.error?.message || 'Cloudinary upload failed');
    }
    const data = await uploadRes.json();
    return { url: data.secure_url };
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
