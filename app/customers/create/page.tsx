// app/customers/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createCustomer } from '@/services/invoiceService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';

/**
 * Page component for creating a new customer.
 * This is a protected route.
 */
const CreateCustomerPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Route protection
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  /**
   * Handles form submission to create the customer.
   */
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
        await createCustomer({ name, email, phone });
        alert('Customer created successfully!');
        
        router.refresh();
        router.push('/customers'); 

      } catch (err: any) {
        setError(err.message || 'Failed to create customer.');
        setIsLoading(false); 
      }
  };
  
  if (isAuthLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Customer</h1>
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
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="123-456-7890"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 border-t pt-6">
             <Button type="button" onClick={() => router.back()} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Customer'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreateCustomerPage;