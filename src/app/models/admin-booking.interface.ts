export interface AdminBooking {
  id: string;
  date: Date;
  timeSlot: string; // e.g., "09:00 AM"
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  treatment: {
    id: string;
    name: string;
    duration: number; // minutes
    price: number; // Rands
  };
  therapist: {
    id: string;
    name: string;
  };
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}
