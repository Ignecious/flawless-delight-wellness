import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AdminBooking } from '../../../models/admin-booking.interface';
import { AdminTreatment } from '../../../models/admin-treatment.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  todaysBookingsCount = 0;
  todaysRevenue = 0;
  nextBooking: AdminBooking | null = null;

  // Mock data - will be populated in ngOnInit
  private mockBookings: AdminBooking[] = [];

  ngOnInit() {
    this.loadMockData();
    this.calculateDashboardStats();
  }

  private loadMockData() {
    const today = new Date(2026, 1, 6); // Feb 6, 2026

    // Create mock bookings
    this.mockBookings = [
      {
        id: '001',
        date: new Date(2026, 1, 6),
        timeSlot: '09:30 AM',
        customer: { name: 'Iggie Mushanguri', phone: '+27821234567', email: 'iggie@example.com' },
        treatment: { id: 't1', name: 'HydraFacial', duration: 60, price: 600 },
        therapist: { id: 'th1', name: 'Sarah Johnson' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 3)
      },
      {
        id: '002',
        date: new Date(2026, 1, 6),
        timeSlot: '10:30 AM',
        customer: { name: 'Sarah Khan', phone: '+27821234568', email: 'sarah@example.com' },
        treatment: { id: 't2', name: 'Microneedling', duration: 60, price: 700 },
        therapist: { id: 'th2', name: 'Emily Brown' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 4)
      },
      {
        id: '003',
        date: new Date(2026, 1, 6),
        timeSlot: '08:00 AM',
        customer: { name: 'John Dlamini', phone: '+27821234569', email: 'john@example.com' },
        treatment: { id: 't5', name: 'Skin Consultation', duration: 30, price: 0 },
        therapist: { id: 'th1', name: 'Sarah Johnson' },
        status: 'completed',
        createdAt: new Date(2026, 1, 3)
      },
      {
        id: '004',
        date: new Date(2026, 1, 6),
        timeSlot: '11:00 AM',
        customer: { name: 'Thandi Nkosi', phone: '+27821234570', email: 'thandi@example.com' },
        treatment: { id: 't6', name: 'Luxury Dermaplaning Session', duration: 60, price: 650 },
        therapist: { id: 'th3', name: 'Thandi Mbele' },
        status: 'pending',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '005',
        date: new Date(2026, 1, 6),
        timeSlot: '13:00 PM',
        customer: { name: 'Michael Smith', phone: '+27821234571', email: 'michael@example.com' },
        treatment: { id: 't3', name: 'Dermapen Therapy and Body Contouring Bundle', duration: 90, price: 900 },
        therapist: { id: 'th1', name: 'Sarah Johnson' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 4)
      },
      {
        id: '006',
        date: new Date(2026, 1, 6),
        timeSlot: '14:30 PM',
        customer: { name: 'Linda Mthembu', phone: '+27821234572', email: 'linda@example.com' },
        treatment: { id: 't7', name: 'Ionic Foot Detox + Infrared Sauna Session', duration: 60, price: 600 },
        therapist: { id: 'th2', name: 'Emily Brown' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '007',
        date: new Date(2026, 1, 6),
        timeSlot: '15:30 PM',
        customer: { name: 'David Naidoo', phone: '+27821234573', email: 'david@example.com' },
        treatment: { id: 't8', name: 'Intense Mark Specialty Treatment', duration: 60, price: 780 },
        therapist: { id: 'th3', name: 'Thandi Mbele' },
        status: 'pending',
        createdAt: new Date(2026, 1, 5)
      },
      {
        id: '008',
        date: new Date(2026, 1, 6),
        timeSlot: '16:30 PM',
        customer: { name: 'Grace Mokoena', phone: '+27821234574', email: 'grace@example.com' },
        treatment: { id: 't4', name: 'Ultimate Face & Body Rejuvenation Combo', duration: 120, price: 800 },
        therapist: { id: 'th1', name: 'Sarah Johnson' },
        status: 'confirmed',
        createdAt: new Date(2026, 1, 5)
      }
    ];
  }

  private calculateDashboardStats() {
    const today = new Date(2026, 1, 6);
    today.setHours(0, 0, 0, 0);

    // Filter today's bookings
    const todaysBookings = this.mockBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate.getTime() === today.getTime();
    });

    // Count bookings
    this.todaysBookingsCount = todaysBookings.length;

    // Calculate revenue (exclude cancelled bookings)
    this.todaysRevenue = todaysBookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, booking) => sum + booking.treatment.price, 0);

    // Find next upcoming booking
    const now = new Date(2026, 1, 6, 9, 0); // Current time: 9:00 AM
    const upcomingBookings = todaysBookings
      .filter(b => b.status !== 'cancelled' && b.status !== 'completed')
      .sort((a, b) => {
        const timeA = this.parseTimeSlot(a.timeSlot);
        const timeB = this.parseTimeSlot(b.timeSlot);
        return timeA.getTime() - timeB.getTime();
      });

    // Find the next booking after current time
    this.nextBooking = upcomingBookings.find(booking => {
      const bookingTime = this.parseTimeSlot(booking.timeSlot);
      return bookingTime.getTime() >= now.getTime();
    }) || null;
  }

  private parseTimeSlot(timeSlot: string): Date {
    const [time, period] = timeSlot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return new Date(2026, 1, 6, hours, minutes);
  }
}
