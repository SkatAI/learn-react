export interface Transaction {
  Date: string;
  Payee: string;
  'Account number': string;
  'Transaction type': string;
  'Payment reference': string;
  Amount: string;
  'Amount (Foreign Currency)': string;
  'Type Foreign Currency': string;
  'Exchange Rate': string;
  [key: string]: string; // For dynamic access with bracket notation
}

export interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}