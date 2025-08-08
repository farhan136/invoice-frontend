// app/invoices/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createInvoice, getCustomers } from '@/services/invoiceService';
import type { Customer } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

// Interface for a single invoice item
interface InvoiceItem {
  item_name: string;
  qty: number;
  price: number;
}

const CreateInvoicePage = () => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();

  // Form states
  const [customerId, setCustomerId] = useState(''); // State for selected customer
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ item_name: '', qty: 1, price: 0 }]);
  
  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]); // State for customer list
  
  // UI states
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auth protection
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Fetch customers for the dropdown
  useEffect(() => {
    if (isAuthenticated) {
      getCustomers()
        .then(response => setCustomers(response.data))
        .catch(() => setError("Failed to load customers."));
    }
  }, [isAuthenticated]);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const itemToUpdate = { ...newItems[index] };
    if (field === 'qty' || field === 'price') {
      itemToUpdate[field] = Number(value) || 0;
    } else {
      itemToUpdate[field] = value as string;
    }
    newItems[index] = itemToUpdate;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { item_name: '', qty: 1, price: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setError("Please select a customer.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Add customer_id to the payload
      await createInvoice({ customer_id: Number(customerId), due_date: dueDate, items });
      router.refresh();
      router.push('/invoices');
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Create New Invoice</h1>
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-gray-200">
          {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Dropdown */}
            <div>
              {/* FIX: Add className to make label text light */}
              <Label htmlFor="customer" className="text-white">Customer</Label>
              <select
                id="customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 border bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>-- Select a Customer --</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            {/* Due Date */}
            <div>
              {/* FIX: Add className to make label text light */}
              <Label htmlFor="dueDate" className="text-white">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mt-8 mb-4 border-t border-gray-700 pt-6">Invoice Items</h2>
          
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-end">
              <div className="col-span-12 md:col-span-5">
                {/* FIX: Add className to make label text light */}
                <Label htmlFor={`item_name-${index}`} className="text-white">Item Name</Label>
                <Input id={`item_name-${index}`} type="text" value={item.item_name} onChange={(e) => handleItemChange(index, 'item_name', e.target.value)} required />
              </div>
              <div className="col-span-4 md:col-span-2">
                {/* FIX: Add className to make label text light */}
                <Label htmlFor={`qty-${index}`} className="text-white">Qty</Label>
                <Input id={`qty-${index}`} type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} min="1" required />
              </div>
              <div className="col-span-8 md:col-span-3">
                {/* FIX: Add className to make label text light */}
                <Label htmlFor={`price-${index}`} className="text-white">Price</Label>
                <Input id={`price-${index}`} type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} min="0" step="0.01" required />
              </div>
              <div className="col-span-12 md:col-span-2">
                <Button type="button" onClick={() => removeItem(index)} className="w-full bg-red-600 hover:bg-red-700" disabled={items.length <= 1}>Remove</Button>
              </div>
            </div>
          ))}

          <Button type="button" onClick={addItem} className="mt-4 bg-slate-600 hover:bg-slate-700">Add Item</Button>

          <div className="flex justify-end mt-8 border-t border-gray-700 pt-6">
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create Invoice'}</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoicePage;