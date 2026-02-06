import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminDataService } from '../../../services/admin-data.service';
import { AdminBooking } from '../../../models/admin-booking.interface';
import { AdminTreatment } from '../../../models/admin-treatment.interface';
import { Therapist } from '../../../models/therapist.interface';

interface StatusFilter {
  label: string;
  value: string;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    BadgeModule,
    CalendarModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit {
  bookings: AdminBooking[] = [];
  filteredBookings: AdminBooking[] = [];
  statusFilters: StatusFilter[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];
  selectedStatus: StatusFilter = this.statusFilters[0];

  displayDetailsDialog = false;
  displayEditDialog = false;
  selectedBooking: AdminBooking | null = null;
  editForm!: FormGroup;

  treatments: AdminTreatment[] = [];
  therapists: Therapist[] = [];
  timeSlots: string[] = [];
  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  constructor(
    private dataService: AdminDataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      date: ['', Validators.required],
      timeSlot: ['', Validators.required],
      treatment: ['', Validators.required],
      therapist: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  loadData(): void {
    this.bookings = this.dataService.getBookings();
    this.treatments = this.dataService.getTreatments();
    this.therapists = this.dataService.getTherapists();
    this.timeSlots = this.dataService.generateTimeSlots();
    
    // Sort by date, latest first
    this.bookings.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedStatus.value === 'all') {
      this.filteredBookings = [...this.bookings];
    } else {
      this.filteredBookings = this.bookings.filter(
        b => b.status === this.selectedStatus.value
      );
    }
  }

  onStatusFilterChange(): void {
    this.applyFilter();
  }

  viewDetails(booking: AdminBooking): void {
    this.selectedBooking = booking;
    this.displayDetailsDialog = true;
    console.log('Viewing booking:', booking.id);
  }

  editBooking(booking: AdminBooking): void {
    this.selectedBooking = booking;
    const treatment = this.treatments.find(t => t.id === booking.treatment.id);
    const therapist = this.therapists.find(t => t.id === booking.therapist.id);
    
    this.editForm.patchValue({
      date: new Date(booking.date),
      timeSlot: booking.timeSlot,
      treatment: treatment,
      therapist: therapist,
      status: booking.status
    });
    
    this.displayEditDialog = true;
    console.log('Editing booking:', booking.id);
  }

  saveBooking(): void {
    if (this.editForm.valid && this.selectedBooking) {
      const formValue = this.editForm.value;
      const updatedBooking: AdminBooking = {
        ...this.selectedBooking,
        date: formValue.date,
        timeSlot: formValue.timeSlot,
        treatment: {
          id: formValue.treatment.id,
          name: formValue.treatment.name,
          duration: formValue.treatment.duration,
          price: formValue.treatment.price
        },
        therapist: {
          id: formValue.therapist.id,
          name: formValue.therapist.name
        },
        status: formValue.status
      };
      
      this.dataService.updateBooking(this.selectedBooking.id, updatedBooking);
      this.loadData();
      this.displayEditDialog = false;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Booking #${this.selectedBooking.id} updated`
      });
      console.log('Booking updated:', this.selectedBooking.id);
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
        this.loadData();
        
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
