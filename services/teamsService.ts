const BASE_URL = "http://localhost:5001/api/teams";

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function getTeamMembers() {
  const res = await fetch(BASE_URL, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch team members');
  return res.json();
}

export async function getTeamMember(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch team member');
  return res.json();
}

export async function createTeamMember(data: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorData = {} as any;
    try { errorData = await res.json(); } catch {}
    throw new Error(errorData.message || 'Failed to create team member');
  }
  return res.json();
}

export async function updateTeamMember(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update team member');
  return res.json();
}

export async function deleteTeamMember(id: string) {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete team member');
  return res.json();
}

export async function uploadImage(file: File) {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
}
