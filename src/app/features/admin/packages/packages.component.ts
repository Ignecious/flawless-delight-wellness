import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminDataService } from '../../../services/admin-data.service';
import { PackageBundle } from '../../../models/package-bundle.interface';
import { PackageFormComponent } from './package-form/package-form.component';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    BadgeModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    PackageFormComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})
export class PackagesComponent implements OnInit {
  packages: PackageBundle[] = [];
  displayDialog = false;
  isEditMode = false;
  selectedPackage: PackageBundle | null = null;

  constructor(
    private dataService: AdminDataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.packages = this.dataService.getPackages();
  }

  openAddDialog(): void {
    this.isEditMode = false;
    this.selectedPackage = null;
    this.displayDialog = true;
    console.log('Opening add package dialog');
  }

  openEditDialog(packageBundle: PackageBundle): void {
    this.isEditMode = true;
    this.selectedPackage = packageBundle;
    this.displayDialog = true;
    console.log('Editing package:', packageBundle.id);
  }

  onPackageSaved(packageBundle: PackageBundle): void {
    if (this.isEditMode && this.selectedPackage) {
      this.dataService.updatePackage(this.selectedPackage.id, packageBundle);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Package updated successfully'
      });
      console.log('Package updated:', this.selectedPackage.id);
    } else {
      this.dataService.addPackage(packageBundle);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Package saved successfully'
      });
      console.log('Package added:', packageBundle.id);
    }
    
    this.loadPackages();
    this.displayDialog = false;
  }

  onDialogCancel(): void {
    this.displayDialog = false;
  }

  deletePackage(packageBundle: PackageBundle): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${packageBundle.name}"?`,
      header: 'Delete Package',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.deletePackage(packageBundle.id);
        this.loadPackages();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Package deleted successfully'
        });
        console.log('Package deleted:', packageBundle.id);
      }
    });
  }

  formatCurrency(amount: number): string {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  formatTreatmentsSummary(packageBundle: PackageBundle): string {
    return packageBundle.treatments
      .map(t => `${t.quantity}x ${t.treatmentName}`)
      .join(', ');
  }

  formatSavingsPercentage(packageBundle: PackageBundle): number {
    if (packageBundle.regularPrice === 0) return 0;
    return Math.round((packageBundle.savings / packageBundle.regularPrice) * 100);
  }

  getStatusBadgeSeverity(isActive: boolean): 'success' | 'secondary' {
    return isActive ? 'success' : 'secondary';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }
}
