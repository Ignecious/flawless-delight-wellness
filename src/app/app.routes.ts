import { Routes } from '@angular/router';
import { HomeComponent } from './features/client/home/home.component';
import { BookServiceComponent } from './features/client/book-service/book-service.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'book-service', component: BookServiceComponent },
  { path: '**', redirectTo: '' }
];
