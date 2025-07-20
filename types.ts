export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number | string;
  customizationNotes?: string;
}

export interface Bill {
  id: string;
  items: BillItem[];
  subtotal: number | string;       // changed
  gstAmount: number | string;      // changed
  grandTotal: number | string;     // changed
  tableNumber: string;
  timestamp: number | string;
  status: string;
}

