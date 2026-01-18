const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface WorkingPaperSeries {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  authors?: string[];
  datePosted?: string;
  availableResources?: string[];
  year?: number;
}

export const workingPaperSeriesService = {
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/working-paper-series/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    
    const response = await fetch(`${API_BASE_URL}/working-paper-series/upload-resource`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async create(data: WorkingPaperSeries): Promise<WorkingPaperSeries> {
    const response = await fetch(`${API_BASE_URL}/working-paper-series`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create working paper series');
    return response.json();
  },

  async getAll(): Promise<WorkingPaperSeries[]> {
    const response = await fetch(`${API_BASE_URL}/working-paper-series`);
    if (!response.ok) throw new Error('Failed to fetch working paper series');
    return response.json();
  },

  async getById(id: string): Promise<WorkingPaperSeries> {
    const response = await fetch(`${API_BASE_URL}/working-paper-series/${id}`);
    if (!response.ok) throw new Error('Working paper series not found');
    return response.json();
  },

  async update(id: string, data: WorkingPaperSeries): Promise<WorkingPaperSeries> {
    const response = await fetch(`${API_BASE_URL}/working-paper-series/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update working paper series');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/working-paper-series/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete working paper series');
  },
};
