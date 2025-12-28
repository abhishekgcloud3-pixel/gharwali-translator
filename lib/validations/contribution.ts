/**
 * Validation Schemas for Community Contributions
 * 
 * This module provides Zod schemas for validating contribution submissions
 * on both client and server side. Ensures data integrity and prevents
 * invalid submissions.
 * 
 * Character Limits:
 * - garhwali_word: 100 characters
 * - hindi_meaning: 200 characters
 * - english_meaning: 200 characters
 * - usage_example: 500 characters
 * - contributor_name: 100 characters
 * - contributor_email: 254 characters (standard email max)
 * 
 * @module lib/validations/contribution
 */

import { z } from 'zod';

/**
 * Valid word categories for contributions
 */
const categorySchema = z.enum([
  'noun',
  'verb', 
  'phrase',
  'song_phrase',
  'adjective',
  'adverb'
]).optional();

/**
 * Email validation regex pattern
 * Basic validation - more comprehensive validation happens server-side
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Main contribution submission schema
 * 
 * Validates all fields submitted by community contributors.
 * Required fields: garhwali_word, hindi_meaning, english_meaning
 * Optional fields: usage_example, category, contributor info
 */
export const contributionSchema = z.object({
  /**
   * The Garhwali word being submitted
   * Required, max 100 characters
   * Should be in Devanagari script for Garhwali
   */
  garhwali_word: z
    .string()
    .min(1, 'Garhwali word is required')
    .max(100, 'Garhwali word must be 100 characters or less')
    .trim()
    .refine((val) => val.length > 0, 'Garhwali word cannot be empty after trimming'),
  
  /**
   * Hindi translation/meaning
   * Required, max 200 characters
   */
  hindi_meaning: z
    .string()
    .min(1, 'Hindi meaning is required')
    .max(200, 'Hindi meaning must be 200 characters or less')
    .trim()
    .refine((val) => val.length > 0, 'Hindi meaning cannot be empty after trimming'),
  
  /**
   * English translation/meaning
   * Required, max 200 characters
   */
  english_meaning: z
    .string()
    .min(1, 'English meaning is required')
    .max(200, 'English meaning must be 200 characters or less')
    .trim()
    .refine((val) => val.length > 0, 'English meaning cannot be empty after trimming'),
  
  /**
   * Example usage sentence
   * Optional, max 500 characters
   * Provides context for how the word is used
   */
  usage_example: z
    .string()
    .max(500, 'Usage example must be 500 characters or less')
    .optional()
    .default(''),
  
  /**
   * Word category for organization
   * Optional, defaults to 'noun'
   */
  category: categorySchema.default('noun'),
  
  /**
   * Contributor's name for attribution
   * Optional, max 100 characters
   */
  contributor_name: z
    .string()
    .max(100, 'Name must be 100 characters or less')
    .optional()
    .default(''),
  
  /**
   * Contributor's email for notifications
   * Optional, validated email format
   */
  contributor_email: z
    .string()
    .max(254, 'Email must be 254 characters or less')
    .optional()
    .refine(
      (val) => !val || emailRegex.test(val),
      'Please enter a valid email address'
    )
    .default(''),
});

/**
 * Admin approval schema
 */
export const approveContributionSchema = z.object({
  contributionId: z
    .string()
    .min(1, 'Contribution ID is required'),
  
  adminPassword: z
    .string()
    .min(1, 'Admin password is required'),
  
  category: categorySchema.optional(),
});

/**
 * Admin rejection schema
 */
export const rejectContributionSchema = z.object({
  contributionId: z
    .string()
    .min(1, 'Contribution ID is required'),
  
  adminPassword: z
    .string()
    .min(1, 'Admin password is required'),
  
  reason: z
    .string()
    .max(500, 'Rejection reason must be 500 characters or less')
    .optional()
    .default(''),
});

/**
 * Bulk action schema for admin operations
 */
export const bulkActionSchema = z.object({
  contributionIds: z
    .array(z.string().min(1))
    .min(1, 'At least one contribution ID is required')
    .max(100, 'Cannot process more than 100 items at once'),
  
  action: z
    .enum(['approve', 'reject']),
  
  adminPassword: z
    .string()
    .min(1, 'Admin password is required'),
  
  reason: z
    .string()
    .max(500, 'Rejection reason must be 500 characters or less')
    .optional()
    .default(''),
});

/**
 * Query schema for listing contributions (admin)
 */
export const listContributionsSchema = z.object({
  status: z
    .enum(['pending', 'approved', 'rejected', 'all'])
    .optional()
    .default('pending'),
  
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .default(1),
  
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(20),
  
  search: z
    .string()
    .max(100)
    .optional(),
});

/**
 * Export type inferences for use in components and API routes
 */
export type ContributionInput = z.infer<typeof contributionSchema>;
export type ApproveContributionInput = z.infer<typeof approveContributionSchema>;
export type RejectContributionInput = z.infer<typeof rejectContributionSchema>;
export type BulkActionInput = z.infer<typeof bulkActionSchema>;
export type ListContributionsInput = z.infer<typeof listContributionsSchema>;

/**
 * Client-side form validation helper
 * 
 * Returns validation errors for a specific field to show
 * real-time feedback in forms
 */
export function validateField(
  field: keyof ContributionInput,
  value: unknown
): string | null {
  try {
    const schema = contributionSchema.shape[field];
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return 'Validation failed';
  }
}
