import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Client } from '../../../../models/client.interface';
import { AdminDataService } from '../../../../services/admin-data.service';
import { AdminBooking } from '../../../../models/admin-booking.interface';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    CardModule,
    BadgeModule,
    TableModule,
    InputTextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit, OnChanges {
  @Input() client!: Client;
  @Input() visible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onNotesUpdated = new EventEmitter<Client>();

  clientBookings: AdminBooking[] = [];
  editableNotes = '';

  constructor(
    private dataService: AdminDataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadClientBookings();
    this.editableNotes = this.client.notes;
  }

  ngOnChanges(): void {
    if (this.client) {
      this.loadClientBookings();
      this.editableNotes = this.client.notes;
    }
  }

  loadClientBookings(): void {
    if (!this.client) return;
    
    const allBookings = this.dataService.getBookings();
    this.clientBookings = allBookings
      .filter(b => b.customer.email === this.client.email)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);
  }

  closeDialog(): void {
    this.onClose.emit();
  }

  saveNotes(): void {
    const updatedClient = {
      ...this.client,
      notes: this.editableNotes
    };
    
    this.onNotesUpdated.emit(updatedClient);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Notes updated successfully'
    });
    
    console.log('Updated client:', updatedClient);
  }

  formatCurrency(amount: number): string {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'info' | 'secondary' {
    return this.dataService.getStatusSeverity(status);
  }

  getClientStatusSeverity(status: string): 'success' | 'secondary' {
    return status === 'active' ? 'success' : 'secondary';
  }

  // Placeholder methods for future features
  editContactInfo(): void {
    console.log('Edit contact info - feature coming soon');
    this.messageService.add({
      severity: 'info',
      summary: 'Coming Soon',
      detail: 'Contact info editing will be available soon'
    });
  }

  bookAppointment(): void {
    console.log('Book appointment - feature coming soon');
    this.messageService.add({
      severity: 'info',
      summary: 'Coming Soon',
      detail: 'Appointment booking will be available soon'
    });
  }
}
