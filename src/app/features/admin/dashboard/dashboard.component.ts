import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AdminBooking } from '../../../models/admin-booking.interface';
import { AdminDataService } from '../../../services/admin-data.service';

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

  constructor(private dataService: AdminDataService) {}

  ngOnInit() {
    this.calculateDashboardStats();
  }

  private calculateDashboardStats() {
    const today = new Date(2026, 1, 6);
    today.setHours(0, 0, 0, 0);

    const allBookings = this.dataService.getBookings();

    // Filter today's bookings
    const todaysBookings = allBookings.filter(booking => {
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
