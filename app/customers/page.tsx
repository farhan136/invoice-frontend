// app/customers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomers } from '@/services/invoiceService';
import type { Customer } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * Page to display a list of customers.
 * This is a protected route.
 */
const CustomersPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Route protection
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Fetch customers data
   useEffect(() => {
    if (isAuthenticated) {
      getCustomers()
        .then(response => {
          // Extract the customer array from the 'data' property
          setCustomers(response.data); 
        })
        .catch(err => {
          setError('Failed to fetch customers.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading Customers...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => router.push('/customers/create')}>
          Add Customer
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {customers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Card key={customer.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold">{customer.name}</h3>
                <p className="text-gray-750">{customer.email}</p>
                <p className="text-gray-650 mt-1">{customer.phone}</p>
              </div>
              <Button
                className="mt-4 w-full bg-gray-600 hover:bg-gray-700"
                onClick={() => router.push(`/customers/${customer.id}/edit`)}
              >
                View & Edit
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-650">No customers found.</p>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;