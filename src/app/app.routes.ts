import { Routes } from '@angular/router';
import { HomeComponent } from './features/client/home/home.component';
import { BookServiceComponent } from './features/client/book-service/book-service.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { CalendarComponent } from './features/admin/calendar/calendar.component';
import { BookingsComponent } from './features/admin/bookings/bookings.component';
import { TreatmentsComponent } from './features/admin/treatments/treatments.component';
import { PackagesComponent } from './features/admin/packages/packages.component';
import { TherapistsComponent } from './features/admin/therapists/therapists.component';
import { ClientsComponent } from './features/admin/clients/clients.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book-service', component: BookServiceComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'treatments', component: TreatmentsComponent },
      { path: 'packages', component: PackagesComponent },
      { path: 'therapists', component: TherapistsComponent },
      { path: 'clients', component: ClientsComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
