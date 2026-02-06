import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminDataService } from '../../../services/admin-data.service';
import { AdminBooking } from '../../../models/admin-booking.interface';

interface TimeSlotRow {
  time: string;
  booking: AdminBooking | null;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CalendarModule,
    ButtonModule,
    BadgeModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  selectedDate: Date = new Date(2026, 1, 6); // February 6, 2026
  timeSlots: TimeSlotRow[] = [];
  displayDetailsDialog = false;
  selectedBooking: AdminBooking | null = null;

  constructor(
    private dataService: AdminDataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadTimeSlots();
  }

  loadTimeSlots(): void {
    const slots = this.dataService.generateTimeSlots();
    const bookings = this.dataService.getBookings();
    
    this.timeSlots = slots.map(time => {
      const booking = bookings.find(b => 
        this.isSameDay(b.date, this.selectedDate) && b.timeSlot === time
      );
      return { time, booking: booking || null };
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  onDateChange(): void {
    this.loadTimeSlots();
  }

  previousDay(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    this.selectedDate = newDate;
    this.loadTimeSlots();
  }

  nextDay(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    this.selectedDate = newDate;
    this.loadTimeSlots();
  }

  getFormattedDate(): string {
    return this.selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  viewDetails(booking: AdminBooking): void {
    this.selectedBooking = booking;
    this.displayDetailsDialog = true;
    console.log('Viewing booking:', booking.id);
  }

  confirmBooking(booking: AdminBooking): void {
    if (booking.status === 'pending') {
      const updatedBooking = { ...booking, status: 'confirmed' as const };
      this.dataService.updateBooking(booking.id, updatedBooking);
      this.loadTimeSlots();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Booking #${booking.id} confirmed`
      });
      console.log('Booking confirmed:', booking.id);
    }
  }

  cancelBooking(booking: AdminBooking): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to cancel booking #${booking.id}?`,
      header: 'Cancel Booking',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const updatedBooking = { ...booking, status: 'cancelled' as const };
        this.dataService.updateBooking(booking.id, updatedBooking);
        this.loadTimeSlots();
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: `Booking #${booking.id} cancelled`
        });
        console.log('Booking cancelled:', booking.id);
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'info' | 'secondary' {
    return this.dataService.getStatusSeverity(status);
  }
}
