/**
 * Represents a single item within an invoice.
 */
export interface InvoiceItem {
  id: number;
  invoice_id: number;
  item_name: string;
  qty: number;
  price: number;
  subtotal: number;
}

/**
 * Represents a full invoice, including its items.
 * Used for the invoice detail page.
 */
export interface Invoice {
  id: number;
  user_id: number;
  customer_id: number;
  invoice_number: string;
  due_date: string;
  total: number;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
  customer?: Customer;
}

/**
 * Represents a summarized invoice.
 * Used for the main invoice list.
 */
export interface InvoiceSummary {
  id: number;
  invoice_number: string;
  total: number;
  due_date: string;
  customer?: Customer;
}

/**
 * Represents a customer.
 */
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}