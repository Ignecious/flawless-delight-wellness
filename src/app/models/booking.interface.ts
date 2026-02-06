import { Treatment } from './treatment.interface';

export interface Booking {
  treatment: Treatment;
  date: Date;
  timeSlot: string;
  user: {
    firstName: string;
    lastName: string;
    dialingCode: string;
    phone: string;
    email: string;
  };
}
