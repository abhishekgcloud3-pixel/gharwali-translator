/**
 * Approve Contribution API Route
 * 
 * POST /api/contributions/approve/[id]
 * 
 * Approve a single contribution and optionally add to dictionary.
 * Requires admin password authentication.
 * 
 * @module app/api/contributions/approve/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { approveContributionSchema } from '@/lib/validations/contribution';
import { approveContribution } from '@/lib/services/contributionService';

/**
 * POST - Approve a contribution
 * 
 * Body:
 * - contributionId: The ID of the contribution to approve
 * - adminPassword: Admin authentication password
 * - category: Optional category override
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = approveContributionSchema.safeParse(body);
    
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
    
    const { contributionId, adminPassword, category } = validationResult.data;
    
    // Approve the contribution
    const result = approveContribution(
      contributionId,
      adminPassword,
      true, // Add to dictionary
      category
    );
    
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error || 'Failed to approve contribution',
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contribution approved successfully',
      contribution: {
        id: result.contribution!.id,
        garhwali_word: result.contribution!.garhwali_word,
        status: result.contribution!.status,
      },
    });
    
  } catch (error) {
    console.error('Error approving contribution:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while approving the contribution',
      },
      { status: 500 }
    );
  }
}
