/**
 * Admin Contributions Page
 * 
 * /admin/contributions
 * 
 * Protected admin interface for reviewing and managing community contributions.
 * 
 * Access Control:
 * - Simple password protection via environment variable ADMIN_PASSWORD
 * - Enter password to access the admin panel
 * 
 * Features:
 * - View pending, approved, and rejected contributions
 * - Approve or reject individual contributions
 * - Bulk approve/reject operations
 * - Import approved words to dictionary
 * - Search and filter contributions
 * - Contribution statistics
 * 
 * Environment Variables:
 * - ADMIN_PASSWORD: Password for admin access (default: garhwali-admin-2024)
 * 
 * @page
 */

'use client';

import * as React from 'react';
import { AdminContributionPanel } from '@/components/AdminContributionPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

export default function AdminContributionsPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password - in production, use proper authentication
    // Default password for development: garhwali-admin-2024
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'garhwali-admin-2024';
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };
  
  // Check if already authenticated (for client-side navigation)
  React.useEffect(() => {
    const saved = sessionStorage.getItem('admin-auth');
    if (saved === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleAuthenticated = () => {
    sessionStorage.setItem('admin-auth', 'authenticated');
  };
  
  if (isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem-12rem)] py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin Panel
              </Badge>
              <span className="text-sm text-muted-foreground">
                Community Contribution Management
              </span>
            </div>
            <h1 className="text-3xl font-bold">Contribution Review</h1>
            <p className="text-muted-foreground mt-1">
              Review, approve, or reject community-submitted words for the Garhwali dictionary.
            </p>
          </div>
          
          <AdminContributionPanel 
            adminPassword={password || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'garhwali-admin-2024'}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[calc(100vh-4rem-12rem)] py-12 px-4">
      <div className="container mx-auto max-w-md">
        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-muted">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Enter the admin password to access the contribution management panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full">
                Access Admin Panel
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo Password:</strong> garhwali-admin-2024
                <br />
                Set NEXT_PUBLIC_ADMIN_PASSWORD in .env for production
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
