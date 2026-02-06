import { Injectable } from '@angular/core';
import { AdminBooking } from '../models/admin-booking.interface';
import { AdminTreatment } from '../models/admin-treatment.interface';
import { Therapist } from '../models/therapist.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private therapists: Therapist[] = [
    { id: '1', name: 'Sarah Johnson', initials: 'SJ' },
    { id: '2', name: 'Emily Brown', initials: 'EB' },
    { id: '3', name: 'Thandi Mbele', initials: 'TM' }
  ];

  private treatments: AdminTreatment[] = [
    { id: 't1', name: 'HydraFacial', duration: 60, price: 600 },
    { id: 't2', name: 'Microneedling', duration: 60, price: 700 },
    { id: 't3', name: 'Dermapen Therapy and Body Contouring Bundle', duration: 90, price: 900 },
    { id: 't4', name: 'Ultimate Face & Body Rejuvenation Combo', duration: 120, price: 800 },
    { id: 't5', name: 'Skin Consultation', duration: 30, price: 0 },
    { id: 't6', name: 'Luxury Dermaplaning Session', duration: 60, price: 650 },
    { id: 't7', name: 'Ionic Foot Detox + Infrared Sauna Session', duration: 60, price: 600 },
    { id: 't8', name: 'Intense Mark Specialty Treatment', duration: 60, price: 780 }
  ];

  private bookings: AdminBooking[] = this.createMockBookings();

  private createMockBookings(): AdminBooking[] {
    return [
      {
        id: '001',
        date: new Date(2026, 1, 6),
        timeSlot: '09:30 AM',
        customer: { name: 'Iggie Mushanguri', phone: '+27821234567', email: 'iggie@example.com' },
        treatment: { id: 't1', name: 'HydraFacial', duration: 60, price: 600 },
        therapist: { id: '1', name: 'Sarah Johnson' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 3)
      },
      {
        id: '002',
        date: new Date(2026, 1, 6),
        timeSlot: '10:30 AM',
        customer: { name: 'Sarah Khan', phone: '+27821234568', email: 'sarah@example.com' },
        treatment: { id: 't2', name: 'Microneedling', duration: 60, price: 700 },
        therapist: { id: '2', name: 'Emily Brown' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 4)
      },
      {
        id: '003',
        date: new Date(2026, 1, 6),
        timeSlot: '08:00 AM',
        customer: { name: 'John Dlamini', phone: '+27821234569', email: 'john@example.com' },
        treatment: { id: 't5', name: 'Skin Consultation', duration: 30, price: 0 },
        therapist: { id: '1', name: 'Sarah Johnson' },
        status: 'completed',
        createdAt: new Date(2026, 1, 3)
      },
      {
        id: '004',
        date: new Date(2026, 1, 6),
        timeSlot: '11:00 AM',
        customer: { name: 'Thandi Nkosi', phone: '+27821234570', email: 'thandi@example.com' },
        treatment: { id: 't6', name: 'Luxury Dermaplaning Session', duration: 60, price: 650 },
        therapist: { id: '3', name: 'Thandi Mbele' },
        status: 'pending',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '005',
        date: new Date(2026, 1, 6),
        timeSlot: '01:00 PM',
        customer: { name: 'Michael Smith', phone: '+27821234571', email: 'michael@example.com' },
        treatment: { id: 't3', name: 'Dermapen Therapy and Body Contouring Bundle', duration: 90, price: 900 },
        therapist: { id: '1', name: 'Sarah Johnson' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 4)
      },
      {
        id: '006',
        date: new Date(2026, 1, 6),
        timeSlot: '02:30 PM',
        customer: { name: 'Linda Mthembu', phone: '+27821234572', email: 'linda@example.com' },
        treatment: { id: 't7', name: 'Ionic Foot Detox + Infrared Sauna Session', duration: 60, price: 600 },
        therapist: { id: '2', name: 'Emily Brown' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '007',
        date: new Date(2026, 1, 6),
        timeSlot: '03:30 PM',
        customer: { name: 'David Naidoo', phone: '+27821234573', email: 'david@example.com' },
        treatment: { id: 't8', name: 'Intense Mark Specialty Treatment', duration: 60, price: 780 },
        therapist: { id: '3', name: 'Thandi Mbele' },
        status: 'pending',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '008',
        date: new Date(2026, 1, 6),
        timeSlot: '04:30 PM',
        customer: { name: 'Grace Mokoena', phone: '+27821234574', email: 'grace@example.com' },
        treatment: { id: 't4', name: 'Ultimate Face & Body Rejuvenation Combo', duration: 120, price: 800 },
        therapist: { id: '1', name: 'Sarah Johnson' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '009',
        date: new Date(2026, 1, 7),
        timeSlot: '09:00 AM',
        customer: { name: 'Peter Williams', phone: '+27821234575', email: 'peter@example.com' },
        treatment: { id: 't1', name: 'HydraFacial', duration: 60, price: 600 },
        therapist: { id: '2', name: 'Emily Brown' },
        status: 'pending',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '010',
        date: new Date(2026, 1, 7),
        timeSlot: '10:30 AM',
        customer: { name: 'Zinhle Khumalo', phone: '+27821234576', email: 'zinhle@example.com' },
        treatment: { id: 't2', name: 'Microneedling', duration: 60, price: 700 },
        therapist: { id: '1', name: 'Sarah Johnson' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '011',
        date: new Date(2026, 1, 8),
        timeSlot: '11:00 AM',
        customer: { name: 'James Brown', phone: '+27821234577', email: 'james@example.com' },
        treatment: { id: 't3', name: 'Dermapen Therapy and Body Contouring Bundle', duration: 90, price: 900 },
        therapist: { id: '3', name: 'Thandi Mbele' },
        status: 'pending',
        createdAt: new Date(2026, 1, 6)
      },
      {
        id: '012',
        date: new Date(2026, 1, 8),
        timeSlot: '02:00 PM',
        customer: { name: 'Sophie Anderson', phone: '+27821234578', email: 'sophie@example.com' },
        treatment: { id: 't6', name: 'Luxury Dermaplaning Session', duration: 60, price: 650 },
        therapist: { id: '2', name: 'Emily Brown' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 6)
      },
      {
        id: '013',
        date: new Date(2026, 1, 9),
        timeSlot: '09:30 AM',
        customer: { name: 'Robert Van Der Merwe', phone: '+27821234579', email: 'robert@example.com' },
        treatment: { id: 't7', name: 'Ionic Foot Detox + Infrared Sauna Session', duration: 60, price: 600 },
        therapist: { id: '1', name: 'Sarah Johnson' },
        status: 'pending',
        createdAt: new Date(2026, 1, 6)
      },
      {
        id: '014',
        date: new Date(2026, 1, 9),
        timeSlot: '01:30 PM',
        customer: { name: 'Maria Santos', phone: '+27821234580', email: 'maria@example.com' },
        treatment: { id: 't8', name: 'Intense Mark Specialty Treatment', duration: 60, price: 780 },
        therapist: { id: '3', name: 'Thandi Mbele' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 6)
      },
      {
        id: '015',
        date: new Date(2026, 1, 5),
        timeSlot: '03:00 PM',
        customer: { name: 'Kevin Ndlovu', phone: '+27821234581', email: 'kevin@example.com' },
        treatment: { id: 't4', name: 'Ultimate Face & Body Rejuvenation Combo', duration: 120, price: 800 },
        therapist: { id: '2', name: 'Emily Brown' },
        status: 'cancelled',
        createdAt: new Date(2026, 1, 3)
      }
    ];
  }

  // Bookings methods
  getBookings(): AdminBooking[] {
    return [...this.bookings];
  }

  getBooking(id: string): AdminBooking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  updateBooking(id: string, updatedBooking: AdminBooking): void {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookings[index] = { ...updatedBooking };
    }
  }

  // Treatments methods
  getTreatments(): AdminTreatment[] {
    return [...this.treatments];
  }

  getTreatment(id: string): AdminTreatment | undefined {
    return this.treatments.find(t => t.id === id);
  }

  addTreatment(treatment: AdminTreatment): void {
    this.treatments.push(treatment);
  }

  updateTreatment(id: string, updatedTreatment: AdminTreatment): void {
    const index = this.treatments.findIndex(t => t.id === id);
    if (index !== -1) {
      this.treatments[index] = { ...updatedTreatment };
    }
  }

  deleteTreatment(id: string): void {
    this.treatments = this.treatments.filter(t => t.id !== id);
  }

  // Therapists methods
  getTherapists(): Therapist[] {
    return [...this.therapists];
  }

  getTherapist(id: string): Therapist | undefined {
    return this.therapists.find(t => t.id === id);
  }

  // Utility methods
  generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 17 && minute > 0) break; // Stop at 5:00 PM
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        
        slots.push(`${displayHour}:${displayMinute} ${period}`);
      }
    }
    return slots;
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'info' | 'secondary' {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  }
}
