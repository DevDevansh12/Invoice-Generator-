export interface Customer {
  id: string;
  name: string;
  address: string;
  gstNo: string;
  panNo: string;
  city: string;
  state: string;
  phoneNo: string;
  emailId: string;
  country: string;
  pinCode: string;
}

export interface GuestName {
  id: string;
  name: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  rate: number;
  quantity: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  billNo: string;
  date: string;
  customerId: string;
  bookedBy: string;
  guestNames: GuestName[];
  vehicleNo: string;
  address: string;
  detailAddress: string;
  contactNo: string;
  emailId: string;
  gstNo: string;
  panNo: string;
  dutyFrom: string;
  dutyTo: string;
  kilometer: string;
  vehicleDetail: string;
  rate: number;
  dutyDescription: string;
  cgst: number;
  sgst: number;
  total: number;
  items: InvoiceItem[];
  signature: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'paid';
}

export interface AppSettings {
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  businessPhone: string;
  businessLogo: string;
  signature: string;
  taxRate: {
    CGST: number;
    SGST: number;
  };
}