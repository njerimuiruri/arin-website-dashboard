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

export async function getCsrs() {
  try {
    const res = await fetch(`${API_BASE_URL}/csr`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch CSRs');
    }
    const data = await res.json();
    // Fix image URLs
    return data.map((csr: any) => ({
      ...csr,
      image: fixImageUrl(csr.image),
      availableResources: fixResourceUrls(csr.availableResources),
    }));
  } catch (error) {
    console.error('Error fetching CSRs:', error);
    return [];
  }
}

export async function getCsr(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/csr/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch CSR');
    }
    const data = await res.json();
    // Fix image URLs
    return {
      ...data,
      image: fixImageUrl(data.image),
      availableResources: fixResourceUrls(data.availableResources),
    };
  } catch (error) {
    console.error('Error fetching CSR:', error);
    return null;
  }
}

export async function createCsr(csr: any) {
  const res = await fetch(`${API_BASE_URL}/csr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(csr),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create CSR: ${error}`);
  }
  return res.json();
}

export async function updateCsr(id: string, csr: any) {
  const res = await fetch(`${API_BASE_URL}/csr/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(csr),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update CSR: ${error}`);
  }
  return res.json();
}

export async function deleteCsr(id: string) {
  const res = await fetch(`${API_BASE_URL}/csr/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete CSR');
  }
  return res.json();
}

export async function uploadCsrImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/csr/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await res.json();
  return data.url;
}

export async function uploadCsrResource(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('resource', file);

  const res = await fetch(`${API_BASE_URL}/csr/upload-resource`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload resource');
  }

  const data = await res.json();
  return data.url;
}
