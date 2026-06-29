const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org') + '/api';

export interface Purchase {
  _id: string;
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
  createdAt: string;
}

export const purchasesService = {
  async getAll(): Promise<Purchase[]> {
    const response = await fetch(`${API_BASE_URL}/purchases`);
    if (!response.ok) throw new Error('Failed to fetch purchases');
    return response.json();
  },
};
