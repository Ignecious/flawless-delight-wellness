import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdminDataService } from '../../../services/admin-data.service';
import { AdminTreatment } from '../../../models/admin-treatment.interface';

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './treatments.component.html',
  styleUrl: './treatments.component.scss'
})
export class TreatmentsComponent implements OnInit {
  treatments: AdminTreatment[] = [];
  displayDialog = false;
  isEditMode = false;
  treatmentForm!: FormGroup;
  selectedTreatment: AdminTreatment | null = null;

  constructor(
    private dataService: AdminDataService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadTreatments();
  }

  initializeForm(): void {
    this.treatmentForm = this.fb.group({
      name: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  loadTreatments(): void {
    this.treatments = this.dataService.getTreatments();
  }

  openAddDialog(): void {
    this.isEditMode = false;
    this.selectedTreatment = null;
    this.treatmentForm.reset();
    this.displayDialog = true;
    console.log('Opening add treatment dialog');
  }

  openEditDialog(treatment: AdminTreatment): void {
    this.isEditMode = true;
    this.selectedTreatment = treatment;
    this.treatmentForm.patchValue({
      name: treatment.name,
      duration: treatment.duration,
      price: treatment.price
    });
    this.displayDialog = true;
    console.log('Editing treatment:', treatment.id);
  }

  saveTreatment(): void {
    if (this.treatmentForm.valid) {
      const formValue = this.treatmentForm.value;
      
      if (this.isEditMode && this.selectedTreatment) {
        // Update existing treatment
        const updatedTreatment: AdminTreatment = {
          ...this.selectedTreatment,
          name: formValue.name,
          duration: formValue.duration,
          price: formValue.price
        };
        
        this.dataService.updateTreatment(this.selectedTreatment.id, updatedTreatment);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Treatment updated successfully'
        });
        console.log('Treatment updated:', this.selectedTreatment.id);
      } else {
        // Add new treatment
        const newTreatment: AdminTreatment = {
          id: 't' + (this.treatments.length + 1),
          name: formValue.name,
          duration: formValue.duration,
          price: formValue.price
        };
        
        this.dataService.addTreatment(newTreatment);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Treatment added successfully'
        });
        console.log('Treatment added:', newTreatment.id);
      }
      
      this.loadTreatments();
      this.displayDialog = false;
    }
  }

  deleteTreatment(treatment: AdminTreatment): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${treatment.name}"?`,
      header: 'Delete Treatment',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dataService.deleteTreatment(treatment.id);
        this.loadTreatments();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Treatment deleted successfully'
        });
        console.log('Treatment deleted:', treatment.id);
      }
    });
  }

  getDialogHeader(): string {
    return this.isEditMode ? 'Edit Treatment' : 'Add Treatment';
  }

  formatPrice(price: number): string {
    return price === 0 ? 'FREE' : `R${price}`;
  }
}
