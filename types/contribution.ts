/**
 * Contribution Types
 * 
 * This module defines TypeScript types for the community contribution system.
 * Contributions allow users to suggest new words and corrections to the Garhwali dictionary.
 * 
 * @module types/contribution
 */

/**
 * Represents the status of a contribution in the review pipeline
 */
export type ContributionStatus = 'pending' | 'approved' | 'rejected';

/**
 * Categories for contributions, matching the dictionary categories
 */
export type ContributionCategory = 
  | 'noun' 
  | 'verb' 
  | 'phrase' 
  | 'song_phrase' 
  | 'adjective' 
  | 'adverb';

/**
 * Optional contributor information for attribution
 */
export interface ContributorInfo {
  name?: string;
  email?: string;
}

/**
 * Main contribution submission from a community member
 */
export interface Contribution {
  /** Unique identifier for the contribution */
  id: string;
  
  /** The Garhwali word being submitted (required, max 100 chars) */
  garhwali_word: string;
  
  /** Hindi translation of the word (required, max 200 chars) */
  hindi_meaning: string;
  
  /** English translation of the word (required, max 200 chars) */
  english_meaning: string;
  
  /** Example usage sentence (optional, max 500 chars) */
  usage_example?: string;
  
  /** Category of the word */
  category: ContributionCategory;
  
  /** Current status in the review process */
  status: ContributionStatus;
  
  /** Optional contributor information */
  contributor?: ContributorInfo;
  
  /** Timestamp when the contribution was submitted */
  submittedAt: string;
  
  /** Timestamp when the contribution was last updated */
  updatedAt: string;
  
  /** Admin who processed the contribution (if processed) */
  processedBy?: string;
  
  /** Reason for rejection (if rejected) */
  rejection_reason?: string;
  
  /** Source metadata - always 'community' for contributions */
  source: 'community';
  
  /** Spam prevention: IP address hash */
  ipHash?: string;
}

/**
 * Extended contribution with admin-specific details
 */
export interface ContributionWithDetails extends Contribution {
  /** Original dictionary entry if this is a correction */
  originalEntry?: {
    garhwali_word: string;
    hindi_meaning: string;
    english_meaning: string;
    usage_example?: string;
  };
}

/**
 * Request body for submitting a new contribution
 */
export interface SubmitContributionRequest {
  garhwali_word: string;
  hindi_meaning: string;
  english_meaning: string;
  usage_example?: string;
  category?: ContributionCategory;
  contributor_name?: string;
  contributor_email?: string;
}

/**
 * Response after submitting a contribution
 */
export interface SubmitContributionResponse {
  success: boolean;
  message: string;
  contributionId?: string;
  duplicateMatches?: Array<{
    garhwali_word: string;
    hindi_meaning: string;
    english_meaning: string;
  }>;
}

/**
 * Request body for approving a contribution
 */
export interface ApproveContributionRequest {
  contributionId: string;
  adminPassword: string;
  category?: ContributionCategory;
}

/**
 * Request body for rejecting a contribution
 */
export interface RejectContributionRequest {
  contributionId: string;
  adminPassword: string;
  reason?: string;
}

/**
 * Statistics for the contribution system
 */
export interface ContributionStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  recentSubmissions: number;
}

/**
 * Admin action log entry
 */
export interface AdminActionLog {
  id: string;
  action: 'approve' | 'reject' | 'bulk_approve' | 'bulk_reject';
  adminId: string;
  contributionIds: string[];
  timestamp: string;
  reason?: string;
}
