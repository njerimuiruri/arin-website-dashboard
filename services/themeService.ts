const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org') + '/api/themes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('arin_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function getThemesByProject(researchProjectId: string) {
  const res = await fetch(`${BASE_URL}?researchProject=${researchProjectId}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch themes');
  return res.json();
}

export async function getTheme(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch theme');
  return res.json();
}

export async function createTheme(data: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorData = {} as any;
    try { errorData = await res.json(); } catch {}
    throw new Error(errorData.message || 'Failed to create theme');
  }
  return res.json();
}

export async function updateTheme(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update theme');
  return res.json();
}

export async function deleteTheme(id: string) {
  const token = localStorage.getItem('arin_access_token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete theme');
  return res.json();
}

export async function reorderThemes(researchProjectId: string, ids: string[]) {
  const token = localStorage.getItem('arin_access_token');
  const res = await fetch(`${BASE_URL}/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: JSON.stringify({ researchProject: researchProjectId, ids }),
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const err = await res.json(); msg = err.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.json();
}
