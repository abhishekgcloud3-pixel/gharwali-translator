/**
 * Admin Contributions API Route
 * 
 * GET /api/contributions/admin
 * 
 * Admin endpoints for managing community contributions.
 * Requires simple password authentication.
 * 
 * Features:
 * - List contributions with pagination and filtering
 * - Get contribution statistics
 * - Bulk approve/reject operations
 * 
 * @module app/api/contributions/admin/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { listContributionsSchema } from '@/lib/validations/contribution';
import {
  listContributions,
  getContributionStats,
  bulkApproveContributions,
  bulkRejectContributions,
  batchImportApproved,
  verifyAdminPassword,
} from '@/lib/services/contributionService';

/**
 * GET - List contributions (admin only)
 * 
 * Query parameters:
 * - status: 'pending' | 'approved' | 'rejected' | 'all' (default: 'pending')
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - search: Search term for filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Verify admin password from header
    const adminPassword = request.headers.get('x-admin-password');
    if (!adminPassword || !verifyAdminPassword(adminPassword)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Admin password required.',
        },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const params = {
      status: (searchParams.get('status') as 'pending' | 'approved' | 'rejected' | 'all') || 'pending',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      search: searchParams.get('search') || undefined,
    };
    
    // Validate parameters
    const validationResult = listContributionsSchema.safeParse(params);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid parameters',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }
    
    const result = listContributions(validationResult.data);
    const stats = getContributionStats();
    
    return NextResponse.json({
      success: true,
      ...result,
      stats,
    });
    
  } catch (error) {
    console.error('Error listing contributions:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve contributions',
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Bulk operations on contributions
 * 
 * Body:
 * - action: 'approve' | 'reject' | 'import'
 * - contributionIds: Array of contribution IDs
 * - adminPassword: Admin authentication
 * - reason: Reason for rejection (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { action, contributionIds, adminPassword, reason } = body;
    
    // Verify admin password
    if (!adminPassword || !verifyAdminPassword(adminPassword)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized. Admin password required.',
        },
        { status: 401 }
      );
    }
    
    // Validate input
    if (!contributionIds || !Array.isArray(contributionIds) || contributionIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contribution IDs are required',
        },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (action) {
      case 'approve':
        result = bulkApproveContributions(contributionIds, adminPassword, true);
        return NextResponse.json({
          success: true,
          message: `Successfully approved ${result.approved.length} contributions`,
          approved: result.approved.length,
          failed: result.failed,
        });
        
      case 'reject':
        result = bulkRejectContributions(contributionIds, adminPassword, reason);
        return NextResponse.json({
          success: true,
          message: `Successfully rejected ${result.rejected.length} contributions`,
          rejected: result.rejected.length,
          failed: result.failed,
        });
        
      case 'import':
        // Import approved contributions to dictionary
        const importResult = batchImportApproved(contributionIds);
        return NextResponse.json({
          success: true,
          message: `Imported ${importResult.imported} entries to dictionary`,
          imported: importResult.imported,
          skipped: importResult.skipped,
          errors: importResult.errors,
        });
        
      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action. Use: approve, reject, or import',
          },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Error processing admin action:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process admin action',
      },
      { status: 500 }
    );
  }
}
