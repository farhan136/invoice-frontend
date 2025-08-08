// app/invoices/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getInvoiceById, updateInvoice, getCustomers } from '@/services/invoiceService';
import type { Customer } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface InvoiceItem {
  item_name: string;
  qty: number;
  price: number;
}

const EditInvoicePage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Form States
  const [customerId, setCustomerId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ item_name: '', qty: 1, price: 0 }]);
  
  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth & Data Fetching
  useEffect(() => {
    if (isAuthenticated && id) {
      // Fetch both customers and the specific invoice
      Promise.all([
        getCustomers(),
        getInvoiceById(Number(id))
      ]).then(([customersResponse, invoiceData]) => {
        // Set customer list for dropdown
        setCustomers(customersResponse.data);

        // Pre-populate the form with invoice data
        const formattedDueDate = new Date(invoiceData.due_date).toISOString().split('T')[0];
        setCustomerId(String(invoiceData.customer_id)); // Set selected customer
        setDueDate(formattedDueDate);
        setItems(invoiceData.items.map(item => ({ item_name: item.item_name, qty: item.qty, price: item.price })));
      }).catch(err => {
        setError('Failed to load invoice data for editing.');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isAuthenticated, id]);
  
  // Form handlers (same as create page)
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  const addItem = () => setItems([...items, { item_name: '', qty: 1, price: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };
  
  // Submission Handler
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
      await updateInvoice(Number(id), { customer_id: Number(customerId), due_date: dueDate, items });
      alert('Invoice updated successfully!');
      router.refresh();
      router.push(`/invoices/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update the invoice.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !error) {
    return <div className="flex justify-center items-center min-h-screen">Loading for Edit...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Edit Invoice</h1>
      <form onSubmit={handleSubmit}>
         <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-gray-200">
            {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Dropdown */}
              <div>
                {/* FIX: Add className to make label text light */}
                <Label htmlFor="customer" className="text-white">Customer</Label>
                <select id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full px-3 py-2 border bg-gray-700 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
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
            
            {/* ... (mapping items logic, same as create page) ... */}
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-3 items-end">
                <div className="col-span-12 md:col-span-5"><Label htmlFor={`item_name-${index}`} className="text-white">Item Name</Label><Input id={`item_name-${index}`} type="text" value={item.item_name} onChange={(e) => handleItemChange(index, 'item_name', e.target.value)} required /></div>
                <div className="col-span-4 md:col-span-2"><Label htmlFor={`qty-${index}`} className="text-white">Qty</Label><Input id={`qty-${index}`} type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', Number(e.target.value))} required /></div>
                <div className="col-span-8 md:col-span-3"><Label htmlFor={`price-${index}`} className="text-white">Price</Label><Input id={`price-${index}`} type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))} required /></div>
                <div className="col-span-12 md:col-span-2"><Button type="button" onClick={() => removeItem(index)} className="w-full bg-red-600 hover:bg-red-700" disabled={items.length <= 1}>Remove</Button></div>
              </div>
            ))}
            
            <Button type="button" onClick={addItem} className="mt-4 bg-slate-600 hover:bg-slate-700">Add Item</Button>
            
            <div className="flex justify-end gap-4 mt-8 border-t border-gray-700 pt-6">
              <Button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
            </div>
         </div>
      </form>
    </div>
  );
};

export default EditInvoicePage;