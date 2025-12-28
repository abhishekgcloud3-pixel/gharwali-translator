/**
 * Reject Contribution API Route
 * 
 * POST /api/contributions/reject/[id]
 * 
 * Reject a single contribution with optional reason.
 * Requires admin password authentication.
 * 
 * @module app/api/contributions/reject/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { rejectContributionSchema } from '@/lib/validations/contribution';
import { rejectContribution } from '@/lib/services/contributionService';

/**
 * POST - Reject a contribution
 * 
 * Body:
 * - contributionId: The ID of the contribution to reject
 * - adminPassword: Admin authentication password
 * - reason: Optional reason for rejection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = rejectContributionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    
    const { contributionId, adminPassword, reason } = validationResult.data;
    
    // Reject the contribution
    const result = rejectContribution(contributionId, adminPassword, reason);
    
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to reject contribution',
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contribution rejected',
      contribution: {
        id: result.contribution!.id,
        garhwali_word: result.contribution!.garhwali_word,
        status: result.contribution!.status,
        rejection_reason: result.contribution!.rejection_reason,
      },
    });
    
  } catch (error) {
    console.error('Error rejecting contribution:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while rejecting the contribution',
      },
      { status: 500 }
    );
  }
}
