
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/impact-stories` : "http://localhost:5001/api/impact-stories";

export async function getImpactStories() {
  const res = await fetch(BASE_URL, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch impact stories');
  return res.json();
}

export async function getImpactStory(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch impact story');
  return res.json();
}

export async function createImpactStory(data: any) {
  // If file upload is needed, use FormData, else JSON
  const hasFile = data.image instanceof File || data.video instanceof File;
  let res;
  if (hasFile) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    res = await fetch(BASE_URL, {
      method: "POST",
      credentials: 'include',
      body: formData,
    });
  } else {
    res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });
  }
  if (!res.ok) {
    let errorData = {};
    try { errorData = await res.json(); } catch {}
    throw new Error(errorData.message || 'Failed to create impact story');
  }
  return res.json();
}

export async function updateImpactStory(id: string, data: any) {
  const hasFile = data.image instanceof File || data.video instanceof File;
  let res;
  if (hasFile) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      credentials: 'include',
      body: formData,
    });
  } else {
    res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(data),
    });
  }
  if (!res.ok) {
    let errorData = {};
    try { errorData = await res.json(); } catch {}
    throw new Error(errorData.message || 'Failed to update impact story');
  }
  return res.json();
}

export async function deleteImpactStory(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete impact story');
  return res.json();
}
