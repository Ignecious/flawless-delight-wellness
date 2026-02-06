export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerSince: Date;
  totalBookings: number;
  totalSpent: number;
  lastVisit: Date | null;
  preferredTherapist: string | null;
  favoriteTreatments: {
    treatmentName: string;
    count: number;
  }[];
  notes: string;
  status: 'active' | 'inactive';
}
