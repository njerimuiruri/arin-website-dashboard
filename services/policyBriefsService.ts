const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface PolicyBrief {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const policyBriefsService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/policy-briefs/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/policy-briefs/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: PolicyBrief): Promise<PolicyBrief> {
    const response = await fetch(`${API_BASE_URL}/policy-briefs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create policy brief');
    return response.json();
  },

  async getAll(): Promise<PolicyBrief[]> {
    const response = await fetch(`${API_BASE_URL}/policy-briefs`);
    if (!response.ok) throw new Error('Failed to fetch policy briefs');
    return response.json();
  },

  async getById(id: string): Promise<PolicyBrief> {
    const response = await fetch(`${API_BASE_URL}/policy-briefs/${id}`);
    if (!response.ok) throw new Error('Policy brief not found');
    return response.json();
  },

  async update(id: string, data: PolicyBrief): Promise<PolicyBrief> {
    const response = await fetch(`${API_BASE_URL}/policy-briefs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update policy brief');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/policy-briefs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete policy brief');
  },
};
