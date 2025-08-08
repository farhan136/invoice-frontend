import { request } from '../lib/api';
import type { Customer } from '@/types'; 

// Define interfaces based on your OpenAPI schema
// This helps with type safety
interface LoginCredentials {
  email: string;
  password: string;
}

interface PaginatedResponse<T> {
  data: T[];
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
}

interface InvoiceItem {
    item_name: string;
    qty: number;
    price: number;
}

interface Invoice {
    id?: number;
    due_date: string;
    items: InvoiceItem[];
    total?: number;
    // Add other invoice properties as needed
}

// --- Authentication ---

/**
 * Authenticate a user.
 * @param credentials - The user's email and password.
 * @returns The auth token.
 */
export const login = (credentials: LoginCredentials): Promise<AuthResponse> => {
  return request<AuthResponse>({
    method: 'POST',
    url: '/login',
    data: credentials,
  });
};

/**
 * Log out the current user.
 */
export const logout = (): Promise<{ message: string }> => {
  return request<{ message: string }>({
    method: 'POST',
    url: '/logout',
  });
};


// --- Customers ---

/**
 * Get a list of all customers.
 * @returns A paginated response containing a list of customers.
 */
export const getCustomers = (): Promise<PaginatedResponse<Customer>> => {
  return request<PaginatedResponse<Customer>>({
    method: 'GET',
    url: '/customers',
  });
};

/**
 * Get a single customer by their ID.
 * @param id - The ID of the customer.
 * @returns The customer object.
 */
export const getCustomerById = (id: number): Promise<Customer> => {
    return request<Customer>({
        method: 'GET',
        url: `/customers/${id}`,
    });
};


/**
 * Create a new customer.
 * @param customerData - The data for the new customer.
 * @returns The newly created customer.
 */
export const createCustomer = (customerData: Customer): Promise<Customer> => {
  return request<Customer>({
    method: 'POST',
    url: '/customers',
    data: customerData,
  });
};

/**
 * Update an existing customer.
 * @param id - The ID of the customer to update.
 * @param customerData - The updated customer data.
 * @returns The updated customer.
 */
export const updateCustomer = (id: number, customerData: Partial<Customer>): Promise<Customer> => {
    return request<Customer>({
        method: 'PUT',
        url: `/customers/${id}`,
        data: customerData,
    });
};

/**
 * Delete a customer by their ID.
 * @param id - The ID of the customer to delete.
 */
export const deleteCustomer = (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>({
        method: 'DELETE',
        url: `/customers/${id}`,
    });
};


// --- Invoices ---

/**
 * Get a list of all invoices.
 * @returns A list of invoices.
 */
export const getInvoices = (): Promise<{ data: Invoice[] }> => {
  return request<{ data: Invoice[] }>({
    method: 'GET',
    url: '/invoices',
  });
};

/**
 * Get a single invoice by its ID.
 * @param id - The ID of the invoice.
 * @returns The invoice object.
 */
export const getInvoiceById = (id: number): Promise<Invoice> => {
    return request<Invoice>({
        method: 'GET',
        url: `/invoices/${id}`,
    });
};


/**
 * Create a new invoice.
 * @param invoiceData - The data for the new invoice.
 * @returns The newly created invoice.
 */
export const createInvoice = (invoiceData: Invoice): Promise<Invoice> => {
  return request<Invoice>({
    method: 'POST',
    url: '/invoices',
    data: invoiceData,
  });
};

/**
 * Update an existing invoice.
 * @param id - The ID of the invoice to update.
 * @param invoiceData - The updated invoice data.
 * @returns The updated invoice.
 */
export const updateInvoice = (id: number, invoiceData: Invoice): Promise<Invoice> => {
    return request<Invoice>({
        method: 'PUT',
        url: `/invoices/${id}`,
        data: invoiceData,
    });
};

/**
 * Delete an invoice by its ID.
 * @param id - The ID of the invoice to delete.
 */
export const deleteInvoice = (id: number): Promise<{ message: string }> => {
    return request<{ message: string }>({
        method: 'DELETE',
        url: `/invoices/${id}`,
    });
};