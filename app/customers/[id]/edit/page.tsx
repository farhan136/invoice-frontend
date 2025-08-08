// app/customers/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomerById, updateCustomer, deleteCustomer } from '@/services/invoiceService';
import type { Customer } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';

/**
 * Page to view, edit, and delete a customer.
 */
const EditCustomerPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [customer, setCustomer] = useState<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>({ name: '', email: '', phone: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Route protection
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Fetch customer data on page load
  useEffect(() => {
    if (isAuthenticated && id) {
      getCustomerById(Number(id))
        .then(response => {
          const customerData = response.data;
          setCustomer({ 
            name: customerData.name, 
            email: customerData.email, 
            phone: customerData.phone 
          });
        })
        .catch(() => {
          setError('Could not load customer data.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await updateCustomer(Number(id), customer);
      alert('Customer updated successfully!');
      router.push('/customers');
    } catch (err: any) {
      setError(err.message || 'Failed to update customer.');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer? This will also delete all their associated invoices.')) {
      try {
        await deleteCustomer(Number(id));
        alert('Customer deleted successfully.');
        router.push('/customers');
      } catch (err: any) {
        setError(err.message || 'Failed to delete customer.');
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading Customer...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Customer</h1>
      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" type="text" value={customer.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={customer.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={customer.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 border-t pt-6">
            <Button type="button" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Customer
            </Button>
            <div className="flex gap-4">
              <Button type="button" onClick={() => router.push('/customers')} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default EditCustomerPage;