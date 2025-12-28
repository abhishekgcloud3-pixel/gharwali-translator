'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Loader2,
} from 'lucide-react';
import type { Contribution, ContributionStats } from '@/types/contribution';

// ============================================================================
// Types
// ============================================================================

interface AdminContributionPanelProps {
  adminPassword: string;
}

// ============================================================================
// Status Badge Component
// ============================================================================

function StatusBadge({ status }: { status: Contribution['status'] }) {
  const config = {
    pending: { 
      bg: 'bg-yellow-100 text-yellow-800', 
      icon: Clock,
      label: 'Pending' 
    },
    approved: { 
      bg: 'bg-green-100 text-green-800', 
      icon: CheckCircle2,
      label: 'Approved' 
    },
    rejected: { 
      bg: 'bg-red-100 text-red-800', 
      icon: XCircle,
      label: 'Rejected' 
    },
  };
  
  const { bg, icon: Icon, label } = config[status];
  
  return (
    <Badge className={cn('flex items-center gap-1', bg)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

// ============================================================================
// Contribution Detail View
// ============================================================================

interface ContributionDetailProps {
  contribution: Contribution;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  isProcessing: boolean;
}

function ContributionDetail({
  contribution,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}: ContributionDetailProps) {
  const [rejectReason, setRejectReason] = React.useState('');
  const [showRejectForm, setShowRejectForm] = React.useState(false);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge status={contribution.status} />
              <span className="text-sm text-muted-foreground">
                ID: {contribution.id.slice(0, 8)}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Word Details */}
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Garhwali Word</p>
              <p className="text-2xl font-bold text-primary">{contribution.garhwali_word}</p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hindi Meaning</p>
                <p className="text-lg">{contribution.hindi_meaning}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">English Meaning</p>
                <p className="text-lg">{contribution.english_meaning}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Category</p>
              <Badge variant="outline">{contribution.category}</Badge>
            </div>
            
            {contribution.usage_example && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Usage Example</p>
                <p className="italic text-muted-foreground">&quot;{contribution.usage_example}&quot;</p>
              </div>
            )}
          </div>
          
          {/* Metadata */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted</span>
              <span>{new Date(contribution.submittedAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{new Date(contribution.updatedAt).toLocaleString()}</span>
            </div>
            {contribution.contributor && (
              <>
                {contribution.contributor.name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contributor</span>
                    <span>{contribution.contributor.name}</span>
                  </div>
                )}
                {contribution.contributor.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{contribution.contributor.email}</span>
                  </div>
                )}
              </>
            )}
            {contribution.rejection_reason && (
              <div className="p-3 bg-red-50 rounded-lg mt-4">
                <p className="text-sm font-medium text-red-800">Rejection Reason</p>
                <p className="text-sm text-red-700">{contribution.rejection_reason}</p>
              </div>
            )}
          </div>
          
          {/* Actions */}
          {contribution.status === 'pending' && (
            <div className="border-t pt-4 flex flex-col gap-3">
              {showRejectForm ? (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Reason for rejection (optional)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onReject(contribution.id, rejectReason);
                        setShowRejectForm(false);
                      }}
                      disabled={isProcessing}
                    >
                      Confirm Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectForm(false)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="default"
                    onClick={() => onApprove(contribution.id)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(true)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Stats Card Component
// ============================================================================

function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  onClick 
}: { 
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
}) {
  return (
    <Card 
      className={cn('cursor-pointer transition-all hover:shadow-md', onClick && 'hover:border-primary')}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn('p-3 rounded-full', color)}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Admin Panel Component
// ============================================================================

export function AdminContributionPanel({ adminPassword }: AdminContributionPanelProps) {
  // State
  const [contributions, setContributions] = React.useState<Contribution[]>([]);
  const [stats, setStats] = React.useState<ContributionStats | null>(null);
  const [selectedContribution, setSelectedContribution] = React.useState<Contribution | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = React.useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  
  // =========================================================================
  // API Calls
  // =========================================================================
  
  const fetchContributions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        page: page.toString(),
        limit: '20',
        ...(searchQuery && { search: searchQuery }),
      });
      
      const response = await fetch(`/api/contributions/admin?${params}`, {
        headers: { 'x-admin-password': adminPassword },
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setContributions(data.contributions);
      setStats(data.stats);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [adminPassword, statusFilter, page, searchQuery]);
  
  // Fetch on filter/page change
  React.useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);
  
  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/contributions/approve', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ contributionId: id, adminPassword }),
      });
      
      if (response.ok) {
        setSelectedContribution(null);
        fetchContributions();
      }
    } catch (error) {
      console.error('Error approving:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReject = async (id: string, reason: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/contributions/reject', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({ contributionId: id, adminPassword, reason }),
      });
      
      if (response.ok) {
        setSelectedContribution(null);
        fetchContributions();
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/contributions/admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({
          action: 'approve',
          contributionIds: Array.from(selectedIds),
          adminPassword,
        }),
      });
      
      if (response.ok) {
        setSelectedIds(new Set());
        fetchContributions();
      }
    } catch (error) {
      console.error('Error bulk approving:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    
    const reason = prompt('Reason for rejection (optional):');
    
    setIsProcessing(true);
    try {
      const response = await fetch('/api/contributions/admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({
          action: 'reject',
          contributionIds: Array.from(selectedIds),
          adminPassword,
          reason: reason || '',
        }),
      });
      
      if (response.ok) {
        setSelectedIds(new Set());
        fetchContributions();
      }
    } catch (error) {
      console.error('Error bulk rejecting:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleImportToDictionary = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Import ${selectedIds.size} approved contributions to dictionary?`)) return;
    
    try {
      const response = await fetch('/api/contributions/admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword,
        },
        body: JSON.stringify({
          action: 'import',
          contributionIds: Array.from(selectedIds),
          adminPassword,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Imported ${data.imported} entries`);
        fetchContributions();
      }
    } catch (error) {
      console.error('Error importing:', error);
    }
  };
  
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const toggleSelectAll = () => {
    if (selectedIds.size === contributions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(contributions.map(c => c.id)));
    }
  };
  
  // =========================================================================
  // Render
  // =========================================================================
  
  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
            color="bg-yellow-100 text-yellow-600"
            onClick={() => setStatusFilter('pending')}
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle2}
            color="bg-green-100 text-green-600"
            onClick={() => setStatusFilter('approved')}
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            color="bg-red-100 text-red-600"
            onClick={() => setStatusFilter('rejected')}
          />
          <StatsCard
            title="This Week"
            value={stats.recentSubmissions}
            icon={AlertTriangle}
            color="bg-blue-100 text-blue-600"
          />
        </div>
      )}
      
      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contributions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
          
          {/* Refresh */}
          <Button variant="outline" size="sm" onClick={fetchContributions} disabled={isLoading}>
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </CardContent>
      </Card>
      
      {/* Bulk Actions */}
      {selectedIds.size > 0 && statusFilter === 'pending' && (
        <Card className="bg-muted/50">
          <CardContent className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">
              {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleBulkApprove} disabled={isProcessing}>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Approve All
              </Button>
              <Button size="sm" variant="outline" onClick={handleBulkReject} disabled={isProcessing}>
                <XCircle className="h-4 w-4 mr-1" />
                Reject All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Import Button for Approved */}
      {statusFilter === 'approved' && selectedIds.size > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="flex items-center justify-between p-4">
            <span className="text-sm font-medium">
              {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <Button size="sm" onClick={handleImportToDictionary}>
              <Download className="h-4 w-4 mr-1" />
              Import to Dictionary
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Contributions List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {statusFilter === 'all' ? 'All Contributions' : 
             statusFilter === 'pending' ? 'Pending Review' : 
             statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </CardTitle>
          <CardDescription>
            {stats ? `${stats.total} total contributions` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : contributions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No contributions found</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-[auto_1fr_150px_120px_100px] gap-4 p-3 bg-muted/50 rounded-t-lg text-sm font-medium">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === contributions.length && contributions.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div>Word</div>
                <div>Contributor</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              {/* Table Body */}
              <div className="divide-y">
                {contributions.map((contribution) => (
                  <div
                    key={contribution.id}
                    className="grid grid-cols-[auto_1fr_150px_120px_100px] gap-4 p-3 items-center hover:bg-muted/25 transition-colors"
                  >
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(contribution.id)}
                        onChange={() => toggleSelect(contribution.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{contribution.garhwali_word}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {contribution.hindi_meaning} → {contribution.english_meaning}
                      </p>
                    </div>
                    <div className="text-sm">
                      {contribution.contributor?.name || 'Anonymous'}
                    </div>
                    <div>
                      <StatusBadge status={contribution.status} />
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedContribution(contribution)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Detail Modal */}
      {selectedContribution && (
        <ContributionDetail
          contribution={selectedContribution}
          onClose={() => setSelectedContribution(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
