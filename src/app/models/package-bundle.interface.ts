export interface PackageBundle {
  id: string;
  name: string;
  description: string;
  treatments: {
    treatmentId: string;
    treatmentName: string;
    quantity: number; // e.g., 3 for 3x HydraFacial
    duration: number; // minutes
    pricePerSession: number; // individual price
  }[];
  packagePrice: number; // Discounted bundle price
  regularPrice: number; // Sum of all individual treatments
  savings: number; // regularPrice - packagePrice
  validityDays: number; // e.g., 90 days
  spacingDays: number; // Minimum days between treatments
  isActive: boolean;
  createdDate: Date;
}
