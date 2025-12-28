/**
 * Submit Contribution API Route
 * 
 * POST /api/contributions/submit
 * 
 * Accepts new word contributions from community members.
 * No authentication required - open to public.
 * 
 * Features:
 * - Validates input using Zod schema
 * - Checks for duplicates in dictionary and pending contributions
 * - Returns matching entries if duplicate detected
 * - Stores contribution for admin review
 * 
 * @module app/api/contributions/submit/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { contributionSchema } from '@/lib/validations/contribution';
import { 
  createContribution, 
  checkForDuplicates 
} from '@/lib/services/contributionService';
import crypto from 'crypto';

/**
 * Create a hash from IP address for spam prevention
 * Uses SHA256 and takes first 16 characters
 */
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

/**
 * GET handler - returns API documentation
 */
export async function GET() {
  return NextResponse.json({
    message: 'Submit Contribution API',
    method: 'POST',
    endpoint: '/api/contributions/submit',
    description: 'Submit a new word contribution to the Garhwali dictionary',
    fields: {
      required: ['garhwali_word', 'hindi_meaning', 'english_meaning'],
      optional: ['usage_example', 'category', 'contributor_name', 'contributor_email'],
    },
    validation: 'Zod schema validation on all fields',
    rateLimit: '100 submissions per hour per IP',
  });
}

/**
 * POST handler - Submit a new contribution
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input against Zod schema
    const validationResult = contributionSchema.safeParse(body);
    
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
    
    const data = validationResult.data;
    
    // Get client IP for spam prevention
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const ipHash = hashIP(ip);
    
    // Check for duplicates before creating
    const duplicates = checkForDuplicates(data.garhwali_word);
    
    // If word exists in dictionary, return error with matches
    if (duplicates.dictionaryMatches.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'This word already exists in the dictionary',
          duplicateMatches: duplicates.dictionaryMatches,
          alreadyExists: true,
        },
        { status: 409 }
      );
    }
    
    // If similar pending contribution exists, warn but allow submission
    if (duplicates.pendingMatches.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'A similar contribution is already pending review',
          duplicateMatches: duplicates.pendingMatches.map(c => ({
            garhwali_word: c.garhwali_word,
            hindi_meaning: c.hindi_meaning,
            english_meaning: c.english_meaning,
          })),
          alreadyExists: false,
        },
        { status: 409 }
      );
    }
    
    // Create the contribution
    const contribution = createContribution(
      {
        garhwali_word: data.garhwali_word,
        hindi_meaning: data.hindi_meaning,
        english_meaning: data.english_meaning,
        usage_example: data.usage_example,
        category: data.category,
        contributor_name: data.contributor_name,
        contributor_email: data.contributor_email,
      },
      ipHash
    );
    
    if (!contribution) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create contribution. Please try again.',
        },
        { status: 500 }
      );
    }
    
    // Return success with contribution ID
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your contribution! It will be reviewed by our team.',
        contributionId: contribution.id,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error submitting contribution:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your submission. Please try again.',
      },
      { status: 500 }
    );
  }
}
