import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CalendarModule } from 'primeng/calendar';
import { AdminDataService } from '../../../services/admin-data.service';
import { Therapist } from '../../../models/therapist.interface';
import { AdminBooking } from '../../../models/admin-booking.interface';

interface TherapistWithBookings extends Therapist {
  todayBookingsCount: number;
}

interface TimeSlotRow {
  time: string;
  booking: AdminBooking | null;
}

@Component({
  selector: 'app-therapists',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    BadgeModule,
    CalendarModule
  ],
  templateUrl: './therapists.component.html',
  styleUrl: './therapists.component.scss'
})
export class TherapistsComponent implements OnInit {
  therapists: TherapistWithBookings[] = [];
  selectedTherapist: TherapistWithBookings | null = null;
  selectedDate: Date = new Date(2026, 1, 6); // February 6, 2026
  timeSlots: TimeSlotRow[] = [];
  showSchedule = false;

  constructor(private dataService: AdminDataService) {}

  ngOnInit(): void {
    this.loadTherapists();
  }

  loadTherapists(): void {
    const therapists = this.dataService.getTherapists();
    const bookings = this.dataService.getBookings();
    const today = new Date(2026, 1, 6); // Mock today as Feb 6, 2026

    this.therapists = therapists.map(therapist => {
      const todayBookingsCount = bookings.filter(b =>
        b.therapist.id === therapist.id &&
        this.isSameDay(b.date, today)
      ).length;

      return {
        ...therapist,
        todayBookingsCount
      };
    });
  }

  viewSchedule(therapist: TherapistWithBookings): void {
    this.selectedTherapist = therapist;
    this.showSchedule = true;
    this.loadSchedule();
    console.log('Viewing schedule for therapist:', therapist.id);
  }

  loadSchedule(): void {
    if (!this.selectedTherapist) return;

    const slots = this.dataService.generateTimeSlots();
    const bookings = this.dataService.getBookings();

    this.timeSlots = slots.map(time => {
      const booking = bookings.find(b =>
        b.therapist.id === this.selectedTherapist!.id &&
        this.isSameDay(b.date, this.selectedDate) &&
        b.timeSlot === time
      );
      return { time, booking: booking || null };
    });
  }

  backToList(): void {
    this.showSchedule = false;
    this.selectedTherapist = null;
  }

  previousDay(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    this.selectedDate = newDate;
    this.loadSchedule();
  }

  nextDay(): void {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    this.selectedDate = newDate;
    this.loadSchedule();
  }

  getFormattedDate(): string {
    return this.selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'info' | 'secondary' {
    return this.dataService.getStatusSeverity(status);
  }
}
