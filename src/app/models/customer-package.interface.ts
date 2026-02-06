export interface CustomerPackage {
  id: string;
  clientId: string;
  clientName: string;
  packageBundleId: string;
  packageName: string;
  purchaseDate: Date;
  expiryDate: Date;
  price: number;
  status: 'active' | 'completed' | 'expired';
  
  treatments: {
    treatmentId: string;
    treatmentName: string;
    totalQuantity: number; // Total in package
    completedQuantity: number; // How many done
    remainingQuantity: number; // How many left
    
    completedSessions: {
      bookingId: string;
      date: Date;
      therapistName: string;
    }[];
  }[];
}
