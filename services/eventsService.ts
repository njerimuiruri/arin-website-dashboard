const API_URL = 'http://localhost:5001';

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

export interface Event {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    status: 'Upcoming' | 'Past';
    category: 'Conference' | 'Workshop' | 'Webinar' | 'Dialogue' | 'Friday Reviews';
    image?: string;
    availableResources?: string[];
    createdAt?: string;
    updatedAt?: string;
}

// Get all events
export async function getEvents(): Promise<Event[]> {
    const res = await fetch(`${API_URL}/events`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`);
    return res.json();
}

// Get single event by ID
export async function getEvent(id: string): Promise<Event> {
    console.log('Fetching event with ID:', id);
    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    console.log('Response status:', res.status, 'Status text:', res.statusText);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch event: ${res.statusText} - ${JSON.stringify(errorData)}`);
    }
    return res.json();
}

// Create new event
export async function createEvent(data: Partial<Event>): Promise<Event> {
    const processedData = {
        ...data,
        date: formatDateForAPI(data.date as string)
    };
    const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
    });
    if (!res.ok) throw new Error(`Failed to create event: ${res.statusText}`);
    return res.json();
}

// Update event
export async function updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    const processedData = {
        ...data,
        date: formatDateForAPI(data.date as string)
    };
    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
    });
    if (!res.ok) throw new Error(`Failed to update event: ${res.statusText}`);
    return res.json();
}

// Delete event
export async function deleteEvent(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to delete event: ${res.statusText}`);
}

// Normalize upload response to a string path/url
function extractUploadPath(data: any): string {
    if (!data) return '';
    // Common shapes we might get back
    return data.url || data.path || data.imageUrl || data.file || '';
}

// Upload image (returns the uploaded path/url as string)
export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/events/upload`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error(`Failed to upload image: ${res.statusText}`);
    const data = await res.json();
    return extractUploadPath(data);
}

// Alias expected by pages
export async function uploadEventImage(file: File): Promise<string> {
    return uploadImage(file);
}

// Upload resource (PDF) (returns the uploaded path/url as string)
export async function uploadResource(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('resource', file);
    const res = await fetch(`${API_URL}/events/upload-resource`, {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) throw new Error(`Failed to upload resource: ${res.statusText}`);
    const data = await res.json();
    return extractUploadPath(data);
}

// Alias expected by pages
export async function uploadEventResource(file: File): Promise<string> {
    return uploadResource(file);
}
