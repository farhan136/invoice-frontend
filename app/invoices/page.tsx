// app/invoices/page.tsx
'use client';

import type { InvoiceSummary } from '@/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getInvoices } from '@/services/invoiceService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';


/**
 * Invoices page to display a list of user's invoices.
 * This is a protected route.
 */
const InvoicesPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Protect the route: redirect if not authenticated
    // We wait until the initial auth check is complete (isAuthLoading is false)
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);
  
  useEffect(() => {
    // Fetch invoices only if the user is authenticated
    if (isAuthenticated) {
      const fetchInvoices = async () => {
        try {
          const response = await getInvoices();
          setInvoices(response.data);
        } catch (err: any) {
          setError('Failed to fetch invoices.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchInvoices();
    }
  }, [isAuthenticated]); // This effect runs when isAuthenticated changes

  // Display a loading screen while checking auth or fetching data
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If not authenticated, the redirect is happening, so we can return null or a loader
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Invoices</h1>
        <Button onClick={() => router.push('/invoices/create')}>
          Create Invoice
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {invoices.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-gray-800 shadow-md rounded-lg p-6 flex flex-col justify-between text-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-white">{invoice.invoice_number}</h3>
                {/* ADD CUSTOMER NAME HERE */}
                {invoice.customer && (
                  <p className="text-sm text-gray-400 mt-1">
                    For: {invoice.customer.name}
                  </p>
                )}
                <p className="text-gray-400">Due Date: {invoice.due_date}</p>
                <p className="text-2xl font-bold mt-4">
                  ${invoice.total.toLocaleString()}
                </p>
              </div>
              <Button 
                className="mt-4 w-full bg-slate-600 hover:bg-slate-700"
                onClick={() => router.push(`/invoices/${invoice.id}`)}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-650">You don't have any invoices yet.</p>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
