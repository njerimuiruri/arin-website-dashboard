const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.demo.arin-africa.org') + '/api';

// Helper function to fix image URLs
const fixImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${API_BASE_URL}${url}`;
};

export async function getVacancies() {
  try {
    const res = await fetch(`${API_BASE_URL}/vacancies`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch vacancies');
    }
    const data = await res.json();
    // Fix image URLs
    return data.map((vacancy: any) => ({
      ...vacancy,
      image: fixImageUrl(vacancy.image),
    }));
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    return [];
  }
}

export async function getVacancy(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/vacancies/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch vacancy');
    }
    const data = await res.json();
    // Fix image URLs
    return {
      ...data,
      image: fixImageUrl(data.image),
    };
  } catch (error) {
    console.error('Error fetching vacancy:', error);
    return null;
  }
}

export async function createVacancy(vacancy: any) {
  const res = await fetch(`${API_BASE_URL}/vacancies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vacancy),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create vacancy: ${error}`);
  }
  return res.json();
}

export async function updateVacancy(id: string, vacancy: any) {
  const res = await fetch(`${API_BASE_URL}/vacancies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vacancy),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update vacancy: ${error}`);
  }
  return res.json();
}

export async function deleteVacancy(id: string) {
  const res = await fetch(`${API_BASE_URL}/vacancies/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete vacancy');
  }
  return res.json();
}

export async function uploadVacancyImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/vacancies/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await res.json();
  return data.url;
}
