import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AdminDataService } from '../../../../services/admin-data.service';
import { PackageBundle } from '../../../../models/package-bundle.interface';
import { AdminTreatment } from '../../../../models/admin-treatment.interface';

interface TreatmentOption {
  label: string;
  value: string;
  duration: number;
  price: number;
}

@Component({
  selector: 'app-package-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    InputSwitchModule
  ],
  templateUrl: './package-form.component.html',
  styleUrl: './package-form.component.scss'
})
export class PackageFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() isEditMode = false;
  @Input() packageData: PackageBundle | null = null;
  @Output() onSave = new EventEmitter<PackageBundle>();
  @Output() onCancel = new EventEmitter<void>();

  packageForm!: FormGroup;
  treatmentOptions: TreatmentOption[] = [];
  allTreatments: AdminTreatment[] = [];

  constructor(
    private fb: FormBuilder,
    private dataService: AdminDataService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadTreatments();
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.loadTreatments();
      if (this.isEditMode && this.packageData) {
        this.populateForm();
      } else {
        this.resetForm();
      }
    }
  }

  initializeForm(): void {
    this.packageForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      treatments: this.fb.array([], [Validators.required, Validators.minLength(2)]),
      packagePrice: [null, [Validators.required, Validators.min(1)]],
      validityDays: [90, [Validators.required, Validators.min(1), Validators.max(365)]],
      spacingDays: [14, [Validators.required, Validators.min(0), Validators.max(90)]],
      isActive: [true]
    });

    // Add initial treatment rows
    this.addTreatmentRow();
    this.addTreatmentRow();
  }

  loadTreatments(): void {
    this.allTreatments = this.dataService.getTreatments();
    this.treatmentOptions = this.allTreatments.map(t => ({
      label: `${t.name} (${t.duration} min - ${this.formatPrice(t.price)})`,
      value: t.id,
      duration: t.duration,
      price: t.price
    }));
  }

  get treatments(): FormArray {
    return this.packageForm.get('treatments') as FormArray;
  }

  createTreatmentFormGroup(): FormGroup {
    return this.fb.group({
      treatmentId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  addTreatmentRow(): void {
    if (this.treatments.length < 10) {
      this.treatments.push(this.createTreatmentFormGroup());
    }
  }

  removeTreatmentRow(index: number): void {
    if (this.treatments.length > 2) {
      this.treatments.removeAt(index);
    }
  }

  getTreatmentDetails(treatmentId: string): AdminTreatment | undefined {
    return this.allTreatments.find(t => t.id === treatmentId);
  }

  calculateRegularPrice(): number {
    let total = 0;
    this.treatments.controls.forEach(control => {
      const treatmentId = control.get('treatmentId')?.value;
      const quantity = control.get('quantity')?.value || 0;
      
      if (treatmentId) {
        const treatment = this.getTreatmentDetails(treatmentId);
        if (treatment) {
          total += treatment.price * quantity;
        }
      }
    });
    return total;
  }

  calculateSavings(): number {
    const regularPrice = this.calculateRegularPrice();
    const packagePrice = this.packageForm.get('packagePrice')?.value || 0;
    return Math.max(0, regularPrice - packagePrice);
  }

  calculateSavingsPercentage(): number {
    const regularPrice = this.calculateRegularPrice();
    const savings = this.calculateSavings();
    if (regularPrice === 0) return 0;
    return Math.round((savings / regularPrice) * 100);
  }

  validatePackagePrice(): boolean {
    const regularPrice = this.calculateRegularPrice();
    const packagePrice = this.packageForm.get('packagePrice')?.value || 0;
    return packagePrice > 0 && packagePrice < regularPrice;
  }

  hasDuplicateTreatments(): boolean {
    const treatmentIds = this.treatments.controls
      .map(c => c.get('treatmentId')?.value)
      .filter(id => id !== null);
    
    const uniqueIds = new Set(treatmentIds);
    return uniqueIds.size !== treatmentIds.length;
  }

  validateForm(): boolean {
    if (!this.packageForm.valid) return false;
    if (this.hasDuplicateTreatments()) return false;
    if (!this.validatePackagePrice()) return false;
    return true;
  }

  populateForm(): void {
    if (!this.packageData) return;

    // Clear existing treatments
    while (this.treatments.length > 0) {
      this.treatments.removeAt(0);
    }

    // Add treatments from package data
    this.packageData.treatments.forEach(t => {
      const treatmentGroup = this.fb.group({
        treatmentId: [t.treatmentId, Validators.required],
        quantity: [t.quantity, [Validators.required, Validators.min(1), Validators.max(10)]]
      });
      this.treatments.push(treatmentGroup);
    });

    // Set other form values
    this.packageForm.patchValue({
      name: this.packageData.name,
      description: this.packageData.description,
      packagePrice: this.packageData.packagePrice,
      validityDays: this.packageData.validityDays,
      spacingDays: this.packageData.spacingDays,
      isActive: this.packageData.isActive
    });
  }

  resetForm(): void {
    this.packageForm.reset({
      name: '',
      description: '',
      packagePrice: null,
      validityDays: 90,
      spacingDays: 14,
      isActive: true
    });

    // Clear and reset treatments
    while (this.treatments.length > 0) {
      this.treatments.removeAt(0);
    }
    this.addTreatmentRow();
    this.addTreatmentRow();
  }

  save(): void {
    if (!this.validateForm()) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.packageForm.controls).forEach(key => {
        this.packageForm.get(key)?.markAsTouched();
      });
      this.treatments.controls.forEach(control => {
        Object.keys((control as FormGroup).controls).forEach(key => {
          control.get(key)?.markAsTouched();
        });
      });
      return;
    }

    const formValue = this.packageForm.value;
    const regularPrice = this.calculateRegularPrice();
    const savings = this.calculateSavings();

    // Build treatments array
    const treatments = formValue.treatments.map((t: any) => {
      const treatmentDetails = this.getTreatmentDetails(t.treatmentId);
      return {
        treatmentId: t.treatmentId,
        treatmentName: treatmentDetails?.name || '',
        quantity: t.quantity,
        duration: treatmentDetails?.duration || 0,
        pricePerSession: treatmentDetails?.price || 0
      };
    });

    const packageBundle: PackageBundle = {
      id: this.isEditMode && this.packageData ? this.packageData.id : this.generatePackageId(),
      name: formValue.name,
      description: formValue.description,
      treatments,
      packagePrice: formValue.packagePrice,
      regularPrice,
      savings,
      validityDays: formValue.validityDays,
      spacingDays: formValue.spacingDays,
      isActive: formValue.isActive,
      createdDate: this.isEditMode && this.packageData ? this.packageData.createdDate : new Date()
    };

    this.onSave.emit(packageBundle);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  generatePackageId(): string {
    return 'pkg-' + Date.now();
  }

  formatPrice(price: number): string {
    return price === 0 ? 'FREE' : `R${price}`;
  }

  formatCurrency(amount: number): string {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  getDialogHeader(): string {
    return this.isEditMode ? 'Edit Package Bundle' : 'Create Package Bundle';
  }
}
