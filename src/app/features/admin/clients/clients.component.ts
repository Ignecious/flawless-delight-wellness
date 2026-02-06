import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminDataService } from '../../../services/admin-data.service';
import { AdminBooking } from '../../../models/admin-booking.interface';
import { Client } from '../../../models/client.interface';
import { ClientDetailComponent } from './client-detail/client-detail.component';

interface StatusFilter {
  label: string;
  value: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    BadgeModule,
    ToastModule,
    ClientDetailComponent
  ],
  providers: [MessageService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchText = '';
  
  statusFilters: StatusFilter[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];
  selectedStatus: StatusFilter = this.statusFilters[0];

  displayClientDetail = false;
  selectedClient: Client | null = null;

  constructor(
    private dataService: AdminDataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const bookings = this.dataService.getBookings();
    this.clients = this.generateClientsFromBookings(bookings);
    
    // Sort by last visit (most recent first)
    this.clients.sort((a, b) => {
      if (!a.lastVisit) return 1;
      if (!b.lastVisit) return -1;
      return b.lastVisit.getTime() - a.lastVisit.getTime();
    });
    
    this.applyFilters();
  }

  generateClientsFromBookings(bookings: AdminBooking[]): Client[] {
    // Group bookings by customer email
    const clientMap = new Map<string, AdminBooking[]>();
    
    bookings.forEach(booking => {
      const email = booking.customer.email;
      if (!clientMap.has(email)) {
        clientMap.set(email, []);
      }
      clientMap.get(email)!.push(booking);
    });

    // Generate client objects from grouped bookings
    const clients: Client[] = [];
    let clientId = 1;

    clientMap.forEach((customerBookings, email) => {
      const firstBooking = customerBookings[0];
      
      // Calculate statistics
      const totalBookings = customerBookings.length;
      const totalSpent = customerBookings.reduce((sum, b) => sum + b.treatment.price, 0);
      
      // Find customer since (earliest booking date)
      const customerSince = new Date(Math.min(...customerBookings.map(b => b.date.getTime())));
      
      // Find last visit (most recent completed booking)
      const completedBookings = customerBookings.filter(b => b.status === 'completed' || b.status === 'confirmed');
      const lastVisit = completedBookings.length > 0 
        ? new Date(Math.max(...completedBookings.map(b => b.date.getTime())))
        : null;
      
      // Calculate preferred therapist (most frequent)
      const therapistCounts = new Map<string, number>();
      customerBookings.forEach(b => {
        const count = therapistCounts.get(b.therapist.name) || 0;
        therapistCounts.set(b.therapist.name, count + 1);
      });
      
      let preferredTherapist: string | null = null;
      let maxCount = 0;
      therapistCounts.forEach((count, therapist) => {
        if (count > maxCount) {
          maxCount = count;
          preferredTherapist = therapist;
        }
      });
      
      // Calculate favorite treatments
      const treatmentCounts = new Map<string, number>();
      customerBookings.forEach(b => {
        const count = treatmentCounts.get(b.treatment.name) || 0;
        treatmentCounts.set(b.treatment.name, count + 1);
      });
      
      const favoriteTreatments = Array.from(treatmentCounts.entries())
        .map(([treatmentName, count]) => ({ treatmentName, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      
      // Determine status (active if last visit within 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const status: 'active' | 'inactive' = lastVisit && lastVisit >= ninetyDaysAgo ? 'active' : 'inactive';
      
      // Generate client notes based on customer
      const notes = this.generateClientNotes(firstBooking.customer.name, totalBookings, preferredTherapist);

      clients.push({
        id: `C${clientId.toString().padStart(3, '0')}`,
        name: firstBooking.customer.name,
        email: firstBooking.customer.email,
        phone: firstBooking.customer.phone,
        customerSince,
        totalBookings,
        totalSpent,
        lastVisit,
        preferredTherapist,
        favoriteTreatments,
        notes,
        status
      });
      
      clientId++;
    });

    return clients;
  }

  generateClientNotes(name: string, bookings: number, therapist: string | null): string {
    const notesOptions = [
      'Regular client. Prefers morning appointments.',
      'First-time client, very happy with results.',
      'Allergic to lavender oil - use alternative products.',
      `Always requests ${therapist} as therapist.`,
      'Prepaid package customer - very loyal.',
      'Prefers afternoon appointments.',
      'Sensitive skin - use gentle products.',
      'VIP client - provide priority booking.'
    ];
    
    // Generate semi-random but consistent notes based on name
    const index = name.length % notesOptions.length;
    return notesOptions[index];
  }

  applyFilters(): void {
    let filtered = [...this.clients];
    
    // Apply status filter
    if (this.selectedStatus.value !== 'all') {
      filtered = filtered.filter(c => c.status === this.selectedStatus.value);
    }
    
    // Apply search filter
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.phone.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
      );
    }
    
    this.filteredClients = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  viewClient(client: Client): void {
    this.selectedClient = client;
    this.displayClientDetail = true;
  }

  onClientDetailClose(): void {
    this.displayClientDetail = false;
    this.selectedClient = null;
  }

  onClientNotesUpdated(updatedClient: Client): void {
    const index = this.clients.findIndex(c => c.id === updatedClient.id);
    if (index !== -1) {
      this.clients[index] = updatedClient;
    }
    this.applyFilters();
  }

  formatCurrency(amount: number): string {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  }

  getStatusSeverity(status: string): 'success' | 'secondary' {
    return status === 'active' ? 'success' : 'secondary';
  }
}
