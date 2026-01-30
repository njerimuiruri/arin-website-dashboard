const API_URL = 'https://api.demo.arin-africa.org/api';

// Helper function to format date for API
function formatDateForAPI(dateString: string): string {
    if (!dateString) return new Date().toISOString();
    
    // Try to parse the date string
    const date = new Date(dateString);
    
    // If valid date, return ISO string
    if (!isNaN(date.getTime())) {
        return date.toISOString();
    }
    
    // Return current date if parsing fails
    return new Date().toISOString();
}

export interface PolicyDialogue {
    _id: string;
    title: string;
    description: string;
    date: string;
    status: 'Ongoing' | 'Completed' | 'Incomplete';
    image?: string;
    availableResources?: string[];
    createdAt?: string;
    updatedAt?: string;
}

// Get all policy dialogues
export async function getPolicyDialogues(): Promise<PolicyDialogue[]> {
    const res = await fetch(`${API_URL}/policy-dialogue`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to fetch policy dialogues: ${res.statusText}`);
    return res.json();
}

// Get single policy dialogue by ID
export async function getPolicyDialogue(id: string): Promise<PolicyDialogue> {
    console.log('Fetching dialogue with ID:', id);
    const res = await fetch(`${API_URL}/policy-dialogue/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    console.log('Response status:', res.status, 'Status text:', res.statusText);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch policy dialogue: ${res.statusText} - ${JSON.stringify(errorData)}`);
    }
    return res.json();
}

// Create new policy dialogue
export async function createPolicyDialogue(data: Partial<PolicyDialogue>): Promise<PolicyDialogue> {
    const processedData = {
        ...data,
        date: formatDateForAPI(data.date as string)
    };
    const res = await fetch(`${API_URL}/policy-dialogue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
    });
    if (!res.ok) throw new Error(`Failed to create policy dialogue: ${res.statusText}`);
    return res.json();
}

// Update policy dialogue
export async function updatePolicyDialogue(id: string, data: Partial<PolicyDialogue>): Promise<PolicyDialogue> {
    const processedData = {
        ...data,
        date: formatDateForAPI(data.date as string)
    };
    const res = await fetch(`${API_URL}/policy-dialogue/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
    });
    if (!res.ok) throw new Error(`Failed to update policy dialogue: ${res.statusText}`);
    return res.json();
}

// Delete policy dialogue
export async function deletePolicyDialogue(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/policy-dialogue/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to delete policy dialogue: ${res.statusText}`);
}

// Upload image
export async function uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/policy-dialogue/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error(`Failed to upload image: ${res.statusText}`);
    return res.json();
}

// Upload resource (PDF)
export async function uploadResource(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('resource', file);
    const res = await fetch(`${API_URL}/policy-dialogue/upload-resource`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error(`Failed to upload resource: ${res.statusText}`);
    return res.json();
}
