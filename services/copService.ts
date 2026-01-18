const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

// Helper function to fix image URLs
const fixImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${API_BASE_URL}${url}`;
};

// Helper function to fix resource URLs in array
const fixResourceUrls = (resources: string[] | undefined): string[] => {
  if (!resources || !Array.isArray(resources)) return [];
  return resources.map(url => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${API_BASE_URL}${url}`;
  });
};

export async function getCops() {
  try {
    const res = await fetch(`${API_BASE_URL}/cop`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch COPs');
    }
    const data = await res.json();
    // Fix image URLs
    return data.map((cop: any) => ({
      ...cop,
      image: fixImageUrl(cop.image),
      availableResources: fixResourceUrls(cop.availableResources),
    }));
  } catch (error) {
    console.error('Error fetching COPs:', error);
    return [];
  }
}

export async function getCop(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/cop/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch COP');
    }
    const data = await res.json();
    // Fix image URLs
    return {
      ...data,
      image: fixImageUrl(data.image),
      availableResources: fixResourceUrls(data.availableResources),
    };
  } catch (error) {
    console.error('Error fetching COP:', error);
    return null;
  }
}

export async function createCop(cop: any) {
  const res = await fetch(`${API_BASE_URL}/cop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cop),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create COP: ${error}`);
  }
  return res.json();
}

export async function updateCop(id: string, cop: any) {
  const res = await fetch(`${API_BASE_URL}/cop/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cop),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update COP: ${error}`);
  }
  return res.json();
}

export async function deleteCop(id: string) {
  const res = await fetch(`${API_BASE_URL}/cop/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete COP');
  }
  return res.json();
}

export async function uploadCopImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/cop/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await res.json();
  return data.url;
}

export async function uploadCopResource(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('resource', file);

  const res = await fetch(`${API_BASE_URL}/cop/upload-resource`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload resource');
  }

  const data = await res.json();
  return data.url;
}
