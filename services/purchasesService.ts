const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org') + '/api';

export interface Purchase {
  _id: string;
  name?: string;
  email: string;
  bookId: string;
  bookTitle: string;
  reference: string;
  amount: number;
  currency: string;
  quantity: number;
  resources: string[];
  status: string;
  emailSent: boolean;
  emailError?: string;
  paidAt?: string;
  createdAt: string;
}

export const purchasesService = {
  async getAll(): Promise<Purchase[]> {
    const response = await fetch(`${API_BASE_URL}/purchases`);
    if (!response.ok) throw new Error('Failed to fetch purchases');
    return response.json();
  },

  async resendEmail(id: string): Promise<Purchase> {
    const response = await fetch(`${API_BASE_URL}/purchases/${id}/resend`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to resend email');
    return response.json();
  },

  async syncFromPaystack(): Promise<{ checked: number; added: number }> {
    const response = await fetch(`${API_BASE_URL}/purchases/sync`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to sync with Paystack');
    return response.json();
  },
};
