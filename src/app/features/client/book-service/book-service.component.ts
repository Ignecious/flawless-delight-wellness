import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Treatment } from '../../../models/treatment.interface';
import { Booking } from '../../../models/booking.interface';

interface DialingCode {
  label: string;
  value: string;
}

@Component({
  selector: 'app-book-service',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './book-service.component.html',
  styleUrls: ['./book-service.component.scss']
})
export class BookServiceComponent implements OnInit {
  bookingForm!: FormGroup;
  treatment: Treatment | null = null;
  selectedDate: Date | null = null;
  selectedTimeSlot: string = '';
  minDate: Date = new Date();
  
  dialingCodes: DialingCode[] = [
    { label: '+27 South Africa', value: '+27' },
    { label: '+1 United States', value: '+1' },
    { label: '+44 United Kingdom', value: '+44' },
    { label: '+91 India', value: '+91' }
  ];
  
  timeSlots: string[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.treatment = navigation.extras.state['treatment'];
    }
    
    // If no treatment data, redirect to home
    if (!this.treatment) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.generateTimeSlots();
    this.initializeForm();
    this.checkLoggedInUser();
  }

  generateTimeSlots(): void {
    const slots: string[] = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break; // Stop after 6:00 PM
        
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayMinute = minute.toString().padStart(2, '0');
        
        slots.push(`${displayHour}:${displayMinute} ${period}`);
      }
    }
    this.timeSlots = slots;
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dialingCode: ['+27', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      date: [null, Validators.required],
      timeSlot: ['', Validators.required]
    });
  }

  checkLoggedInUser(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      // Pre-fill form with mock logged-in user data
      this.bookingForm.patchValue({
        firstName: 'Iggie',
        lastName: 'Mushanguri',
        dialingCode: '+27',
        phone: '0782441803',
        email: 'iggytanakamush@gmail.com'
      });
    }
  }

  onDateChange(date: Date): void {
    this.selectedDate = date;
  }

  onTimeSlotChange(timeSlot: string): void {
    this.selectedTimeSlot = timeSlot;
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.controls[key].markAsTouched();
      });
      
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.bookingForm.value;
    
    const booking: Booking = {
      treatment: this.treatment!,
      date: formValue.date,
      timeSlot: formValue.timeSlot,
      user: {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        dialingCode: formValue.dialingCode,
        phone: formValue.phone,
        email: formValue.email
      }
    };

    console.log('Booking Details:', booking);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Booking confirmed!'
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (field?.hasError('pattern')) {
      return 'Please enter a valid 10-digit phone number';
    }
    
    return '';
  }
}
