const BASE_URL = "http://localhost:5001/research-projects";

export async function getResearchProjects() {
  const res = await fetch(BASE_URL, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch research projects');
  return res.json();
}

export async function getResearchProject(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch research project');
  return res.json();
}

export async function createResearchProject(data: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch (e) {
      // ignore JSON parse error
    }
    console.error('Create project error:', errorData, 'Status:', res.status);
    throw new Error(errorData.message || 'Failed to create research project');
  }
  return res.json();
}

export async function updateResearchProject(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update research project');
  return res.json();
}

export async function deleteResearchProject(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete research project');
  return res.json();
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
}

export async function uploadDescriptionImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/upload-description-image`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to upload description image');
  return res.json();
}
