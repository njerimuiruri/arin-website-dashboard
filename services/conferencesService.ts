const getApiUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:5001/api';
  return (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001') + '/api';
};

const API_BASE_URL = getApiUrl();

export interface Conference {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  venue?: string;
  date: string;
  category?: string;
  availableResources?: string[];
  year?: number;
}

const extractUploadPath = (response: any): string => {
  if (typeof response === 'string') return response;
  if (response?.url) return response.url;
  return '';
};

export const getConferences = async (): Promise<Conference[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conferences`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch conferences');
    const data = await response.json();
    
    // Fix image URLs to include backend base URL
    return data.map((conf: Conference) => ({
      ...conf,
      image: conf.image && conf.image.startsWith('/uploads') 
        ? API_BASE_URL + conf.image 
        : conf.image
    }));
  } catch (error) {
    console.error('Error fetching conferences:', error);
    throw error;
  }
};

export const getConference = async (id: string): Promise<Conference> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conferences/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch conference');
    const data = await response.json();
    
    // Fix image URL to include backend base URL
    if (data.image && data.image.startsWith('/uploads')) {
      data.image = API_BASE_URL + data.image;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching conference:', error);
    throw error;
  }
};

export const createConference = async (data: Conference): Promise<Conference> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create conference');
    return response.json();
  } catch (error) {
    console.error('Error creating conference:', error);
    throw error;
  }
};

export const updateConference = async (id: string, data: Conference): Promise<Conference> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conferences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update conference');
    return response.json();
  } catch (error) {
    console.error('Error updating conference:', error);
    throw error;
  }
};

export const deleteConference = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/conferences/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete conference');
  } catch (error) {
    console.error('Error deleting conference:', error);
    throw error;
  }
};

export const uploadConferenceImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/conferences/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload image');
    const result = await response.json();
    return extractUploadPath(result);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadConferenceResource = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('resource', file);

    const response = await fetch(`${API_BASE_URL}/conferences/upload-resource`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload resource');
    const result = await response.json();
    return extractUploadPath(result);
  } catch (error) {
    console.error('Error uploading resource:', error);
    throw error;
  }
};
