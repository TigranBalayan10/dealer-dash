// Enums
export enum Status {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  LEASED = "LEASED",
}

export enum TransactionType {
  SALE = "SALE",
  LEASE = "LEASE",
  BROKER = "BROKER",
}

// Interfaces
export interface User {
  id: string;
  clerkId: string | null;
  businessName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string;
  subscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
  inventoryItems: InventoryItem[];
  customers: Customer[];
  transactions: Transaction[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ssn: string | null;
  dateOfBirth: Date;
  licenseNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  transactions: Transaction[];
}

export interface InventoryItem {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string | null;
  status: Status;
  vin: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  commission: number;
  date: Date;
  notes: string | null;
  userId: string;
  user: User;
  customerId: string;
  customer: Customer;
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  financialDetails: FinancialDetails | null;
}

export interface FinancialDetails {
  id: string;
  downPayment: number | null;
  monthlyPayment: number | null;
  leaseTerm: number | null;
  interestRate: number | null;
  totalLeaseCost: number | null;
  residualValue: number | null;
  transactionId: string;
  transaction: Transaction;
}
