/**
 * Contribution Service
 * 
 * Business logic layer for managing community contributions.
 * Handles storage, duplicate detection, approval workflows, and
 * integration with the main dictionary.
 * 
 * Storage: Uses JSON file at /data/contributions.json
 * 
 * @module lib/services/contributionService
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { 
  Contribution, 
  ContributionStatus, 
  ContributionStats 
} from '@/types/contribution';
import type { DictionaryEntry } from '@/types/dictionary';

// ============================================================================
// Configuration
// ============================================================================

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTRIBUTIONS_FILE = path.join(DATA_DIR, 'contributions.json');
const DICTIONARY_FILE = path.join(process.cwd(), 'lib', 'garhwali_dictionary.json');

// ============================================================================
// Storage Helpers
// ============================================================================

/**
 * Ensure data directory exists
 */
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

/**
 * Load all contributions from storage
 */
function loadContributions(): Contribution[] {
  try {
    if (!fs.existsSync(CONTRIBUTIONS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(CONTRIBUTIONS_FILE, 'utf-8');
    return JSON.parse(data, (key, value) => {
      // Convert date strings back to Date objects for comparison
      if (key === 'submittedAt' || key === 'updatedAt') {
        return new Date(value).toISOString();
      }
      return value;
    });
  } catch (error) {
    console.error('Error loading contributions:', error);
    return [];
  }
}

/**
 * Save all contributions to storage
 */
function saveContributions(contributions: Contribution[]): void {
  ensureDataDir();
  fs.writeFileSync(
    CONTRIBUTIONS_FILE,
    JSON.stringify(contributions, null, 2),
    'utf-8'
  );
}

/**
 * Load the main dictionary for duplicate checking
 */
function loadDictionary(): DictionaryEntry[] {
  try {
    if (!fs.existsSync(DICTIONARY_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DICTIONARY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return [];
  }
}

// ============================================================================
// Duplicate Detection
// ============================================================================

/**
 * Check if a word already exists in the dictionary
 * Returns matching entries if found
 */
export function findDictionaryDuplicates(
  garhwaliWord: string
): DictionaryEntry[] {
  const dictionary = loadDictionary();
  const normalizedWord = garhwaliWord.toLowerCase().trim();
  
  return dictionary.filter(entry => 
    entry.garhwali_word.toLowerCase().trim() === normalizedWord
  );
}

/**
 * Check if a similar contribution already exists
 */
export function findContributionDuplicates(
  garhwaliWord: string,
  excludeId?: string
): Contribution[] {
  const contributions = loadContributions();
  const normalizedWord = garhwaliWord.toLowerCase().trim();
  
  return contributions.filter(contribution => {
    // Skip if it's the same contribution (for edits)
    if (excludeId && contribution.id === excludeId) {
      return false;
    }
    // Only check pending contributions
    if (contribution.status !== 'pending') {
      return false;
    }
    return contribution.garhwali_word.toLowerCase().trim() === normalizedWord;
  });
}

/**
 * Check for duplicates in both dictionary and pending contributions
 */
export function checkForDuplicates(
  garhwaliWord: string,
  excludeId?: string
): {
  dictionaryMatches: DictionaryEntry[];
  pendingMatches: Contribution[];
} {
  return {
    dictionaryMatches: findDictionaryDuplicates(garhwaliWord),
    pendingMatches: findContributionDuplicates(garhwaliWord, excludeId),
  };
}

// ============================================================================
// Contribution CRUD Operations
// ============================================================================

/**
 * Create a new contribution
 * 
 * @param data - The contribution data
 * @param ipHash - Hash of submitter's IP for spam prevention
 * @returns The created contribution or null if validation fails
 */
export function createContribution(
  data: {
    garhwali_word: string;
    hindi_meaning: string;
    english_meaning: string;
    usage_example?: string;
    category: string;
    contributor_name?: string;
    contributor_email?: string;
  },
  ipHash?: string
): Contribution | null {
  // Validate the word isn't already in the dictionary
  const dictionaryMatches = findDictionaryDuplicates(data.garhwali_word);
  if (dictionaryMatches.length > 0) {
    return null;
  }

  const now = new Date().toISOString();
  
  const contribution: Contribution = {
    id: randomUUID(),
    garhwali_word: data.garhwali_word.trim(),
    hindi_meaning: data.hindi_meaning.trim(),
    english_meaning: data.english_meaning.trim(),
    usage_example: data.usage_example?.trim() || '',
    category: data.category as Contribution['category'],
    status: 'pending',
    source: 'community',
    submittedAt: now,
    updatedAt: now,
    ipHash,
  };

  // Add contributor info if provided
  if (data.contributor_name || data.contributor_email) {
    contribution.contributor = {};
    if (data.contributor_name) {
      contribution.contributor.name = data.contributor_name.trim();
    }
    if (data.contributor_email) {
      contribution.contributor.email = data.contributor_email.trim();
    }
  }

  const contributions = loadContributions();
  contributions.push(contribution);
  saveContributions(contributions);

  return contribution;
}

/**
 * Get a contribution by ID
 */
export function getContributionById(id: string): Contribution | null {
  const contributions = loadContributions();
  return contributions.find(c => c.id === id) || null;
}

/**
 * List contributions with optional filtering
 */
export function listContributions(options: {
  status?: ContributionStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
}): {
  contributions: Contribution[];
  total: number;
  pages: number;
} {
  let contributions = loadContributions();
  
  // Filter by status
  if (options.status && options.status !== 'all') {
    contributions = contributions.filter(c => c.status === options.status);
  }
  
  // Filter by search term
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    contributions = contributions.filter(c =>
      c.garhwali_word.toLowerCase().includes(searchLower) ||
      c.hindi_meaning.toLowerCase().includes(searchLower) ||
      c.english_meaning.toLowerCase().includes(searchLower) ||
      c.contributor?.name?.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by date (newest first)
  contributions.sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  
  const total = contributions.length;
  const page = options.page || 1;
  const limit = options.limit || 20;
  const pages = Math.ceil(total / limit);
  
  const start = (page - 1) * limit;
  const paginatedContributions = contributions.slice(start, start + limit);
  
  return {
    contributions: paginatedContributions,
    total,
    pages,
  };
}

/**
 * Update a contribution's status
 */
function updateContributionStatus(
  id: string,
  status: ContributionStatus,
  processedBy?: string,
  reason?: string
): Contribution | null {
  const contributions = loadContributions();
  const index = contributions.findIndex(c => c.id === id);
  
  if (index === -1) {
    return null;
  }
  
  contributions[index] = {
    ...contributions[index],
    status,
    updatedAt: new Date().toISOString(),
    processedBy,
    rejection_reason: status === 'rejected' ? reason : undefined,
  };
  
  saveContributions(contributions);
  return contributions[index];
}

// ============================================================================
// Approval Workflow
// ============================================================================

/**
 * Simple admin password check
 * In production, use environment variable and proper auth
 */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'garhwali-admin-2024';

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/**
 * Approve a contribution and optionally add to dictionary
 */
export function approveContribution(
  contributionId: string,
  adminPassword: string,
  addToDictionary: boolean = true,
  category?: string
): { success: boolean; contribution?: Contribution; error?: string } {
  // Verify admin password
  if (!verifyAdminPassword(adminPassword)) {
    return { success: false, error: 'Invalid admin password' };
  }
  
  // Get the contribution
  const contribution = getContributionById(contributionId);
  if (!contribution) {
    return { success: false, error: 'Contribution not found' };
  }
  
  if (contribution.status !== 'pending') {
    return { success: false, error: 'Contribution is not pending' };
  }
  
  // Update status to approved
  const approved = updateContributionStatus(
    contributionId, 
    'approved', 
    'admin',
    undefined
  );
  
  if (!approved) {
    return { success: false, error: 'Failed to update contribution' };
  }
  
  // Optionally add to dictionary
  if (addToDictionary) {
    addToGarhwaliDictionary({
      garhwali_word: approved.garhwali_word,
      hindi_meaning: approved.hindi_meaning,
      english_meaning: approved.english_meaning,
      usage_example: approved.usage_example || '',
      category: (category || approved.category) as DictionaryEntry['category'],
    });
  }
  
  return { success: true, contribution: approved };
}

/**
 * Reject a contribution
 */
export function rejectContribution(
  contributionId: string,
  adminPassword: string,
  reason?: string
): { success: boolean; contribution?: Contribution; error?: string } {
  // Verify admin password
  if (!verifyAdminPassword(adminPassword)) {
    return { success: false, error: 'Invalid admin password' };
  }
  
  // Get the contribution
  const contribution = getContributionById(contributionId);
  if (!contribution) {
    return { success: false, error: 'Contribution not found' };
  }
  
  if (contribution.status !== 'pending') {
    return { success: false, error: 'Contribution is not pending' };
  }
  
  // Update status to rejected
  const rejected = updateContributionStatus(
    contributionId, 
    'rejected', 
    'admin',
    reason
  );
  
  if (!rejected) {
    return { success: false, error: 'Failed to update contribution' };
  }
  
  return { success: true, contribution: rejected };
}

/**
 * Bulk approve contributions
 */
export function bulkApproveContributions(
  contributionIds: string[],
  adminPassword: string,
  addToDictionary: boolean = true
): {
  approved: Contribution[];
  failed: { id: string; reason: string }[];
} {
  const approved: Contribution[] = [];
  const failed: { id: string; reason: string }[] = [];
  
  for (const id of contributionIds) {
    const result = approveContribution(id, adminPassword, addToDictionary);
    if (result.success && result.contribution) {
      approved.push(result.contribution);
    } else {
      failed.push({ id, reason: result.error || 'Unknown error' });
    }
  }
  
  return { approved, failed };
}

/**
 * Bulk reject contributions
 */
export function bulkRejectContributions(
  contributionIds: string[],
  adminPassword: string,
  reason?: string
): {
  rejected: Contribution[];
  failed: { id: string; reason: string }[];
} {
  const rejected: Contribution[] = [];
  const failed: { id: string; reason: string }[] = [];
  
  for (const id of contributionIds) {
    const result = rejectContribution(id, adminPassword, reason);
    if (result.success && result.contribution) {
      rejected.push(result.contribution);
    } else {
      failed.push({ id, reason: result.error || 'Unknown error' });
    }
  }
  
  return { rejected, failed };
}

// ============================================================================
// Dictionary Integration
// ============================================================================

/**
 * Add an entry to the Garhwali dictionary
 */
export function addToGarhwaliDictionary(entry: DictionaryEntry): void {
  const dictionary = loadDictionary();
  
  // Check if entry already exists
  const exists = dictionary.some(
    e => e.garhwali_word.toLowerCase() === entry.garhwali_word.toLowerCase()
  );
  
  if (!exists) {
    dictionary.push(entry);
    dictionary.sort((a, b) => 
      a.garhwali_word.localeCompare(b.garhwali_word, 'hi')
    );
    
    fs.writeFileSync(
      DICTIONARY_FILE,
      JSON.stringify(dictionary, null, 2),
      'utf-8'
    );
  }
}

/**
 * Batch import approved contributions to dictionary
 * Useful for importing multiple approved words at once
 */
export function batchImportApproved(
  contributionIds?: string[]
): {
  imported: number;
  skipped: number;
  errors: string[];
} {
  const contributions = loadContributions();
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];
  
  // Filter approved contributions
  const toImport = contributionIds
    ? contributions.filter(c => contributionIds.includes(c.id) && c.status === 'approved')
    : contributions.filter(c => c.status === 'approved');
  
  for (const contribution of toImport) {
    try {
      // Check if already in dictionary
      const dictionary = loadDictionary();
      const exists = dictionary.some(
        e => e.garhwali_word.toLowerCase() === contribution.garhwali_word.toLowerCase()
      );
      
      if (!exists) {
        addToGarhwaliDictionary({
          garhwali_word: contribution.garhwali_word,
          hindi_meaning: contribution.hindi_meaning,
          english_meaning: contribution.english_meaning,
          usage_example: contribution.usage_example || '',
          category: contribution.category,
        });
        imported++;
      } else {
        skipped++;
      }
    } catch (error) {
      errors.push(`Failed to import "${contribution.garhwali_word}": ${error}`);
    }
  }
  
  return { imported, skipped, errors };
}

// ============================================================================
// Statistics
// ============================================================================

/**
 * Get contribution statistics
 */
export function getContributionStats(): ContributionStats {
  const contributions = loadContributions();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const pending = contributions.filter(c => c.status === 'pending').length;
  const approved = contributions.filter(c => c.status === 'approved').length;
  const rejected = contributions.filter(c => c.status === 'rejected').length;
  const recentSubmissions = contributions.filter(
    c => new Date(c.submittedAt) > weekAgo
  ).length;
  
  return {
    pending,
    approved,
    rejected,
    total: contributions.length,
    recentSubmissions,
  };
}

// ============================================================================
// Cleanup Operations (Admin Use)
// ============================================================================

/**
 * Delete old rejected contributions (older than specified days)
 */
export function cleanupOldContributions(daysOld: number = 90): number {
  const contributions = loadContributions();
  const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  
  const filtered = contributions.filter(c => {
    if (c.status !== 'rejected') return true;
    return new Date(c.updatedAt) > cutoff;
  });
  
  const deleted = contributions.length - filtered.length;
  if (deleted > 0) {
    saveContributions(filtered);
  }
  
  return deleted;
}
