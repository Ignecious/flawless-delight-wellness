import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, ToastModule, ConfirmDialogModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  sidebarOpen = true;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/admin/dashboard' },
    { label: 'Calendar', icon: 'pi pi-calendar', route: '/admin/calendar' },
    { label: 'Bookings', icon: 'pi pi-list', route: '/admin/bookings' },
    { label: 'Treatments', icon: 'pi pi-briefcase', route: '/admin/treatments' },
    { label: 'Packages', icon: 'pi pi-box', route: '/admin/packages' },
    { label: 'Therapists', icon: 'pi pi-users', route: '/admin/therapists' },
    { label: 'Clients', icon: 'pi pi-user', route: '/admin/clients' }
  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
