// app/invoices/[id]/page.tsx
'use client';

import type { Invoice } from '@/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getInvoiceById, deleteInvoice } from '@/services/invoiceService';
import { Button } from '@/components/ui/Button';

/**
 * Page to display the details of a single invoice.
 * This is a dynamic and protected route.
 */
const InvoiceDetailPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      const fetchInvoice = async () => {
        try {
          const invoiceData = await getInvoiceById(Number(id));
          setInvoice(invoiceData.data); // Assuming the single invoice is also wrapped in 'data'
        } catch (err: any) {
          setError('Failed to fetch invoice details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInvoice();
    }
  }, [isAuthenticated, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(Number(id));
        alert('Invoice deleted successfully!');
        router.push('/invoices');
      } catch (err: any) {
        setError(err.message || 'Failed to delete the invoice.');
      }
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-white">Loading Invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-red-400">{error}</p>
          <Button onClick={() => router.push('/invoices')} className="mt-4">
            Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {invoice && (
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-gray-200">
          {/* Main Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 pb-6 border-b border-gray-700">
            {/* Left Side: Invoice and Customer Info */}
            <div>
              <h1 className="text-3xl font-bold text-white">{invoice.invoice_number}</h1>
              <p className="text-gray-400 mt-1">
                Created on: {new Date(invoice.created_at).toLocaleDateString()}
              </p>
              
              {/* === CUSTOMER INFO STARTS HERE === */}
              {invoice.customer && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 uppercase font-semibold">BILLED TO</p>
                  <p className="text-lg text-gray-200 font-medium">{invoice.customer.name}</p>
                  <p className="text-gray-400">{invoice.customer.email}</p>
                </div>
              )}
              {/* === CUSTOMER INFO ENDS HERE === */}
            </div>

            {/* Right Side: Totals */}
            <div className="text-left md:text-right mt-4 md:mt-0">
              <p className="text-lg text-gray-300">Total Amount</p>
              <p className="text-4xl font-extrabold text-blue-500">
                ${invoice.total.toLocaleString()}
              </p>
              <p className="text-red-400 font-semibold mt-1">
                Due on: {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Items Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Items</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-gray-400 font-semibold">Item Name</th>
                    <th className="px-4 py-2 text-gray-400 font-semibold">Quantity</th>
                    <th className="px-4 py-2 text-gray-400 font-semibold">Price</th>
                    <th className="px-4 py-2 text-right text-gray-400 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700">
                      <td className="px-4 py-3 font-medium text-gray-200">{item.item_name}</td>
                      <td className="px-4 py-3 text-gray-300">{item.qty}</td>
                      <td className="px-4 py-3 text-gray-300">${item.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-200">${item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Actions Section */}
          <div className="flex justify-end gap-4 mt-8 border-t border-gray-700 pt-6">
            <Button className="bg-slate-600 hover:bg-slate-700" onClick={() => router.push(`/invoices/${id}/edit`)}>
              Edit Invoice
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Delete Invoice
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetailPage;