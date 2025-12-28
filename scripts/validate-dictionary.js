#!/usr/bin/env node

/**
 * Garhwali Seva Dictionary Validation Script
 * 
 * This script validates the structure and content of the Garhwali dictionary.
 */

const fs = require('fs');
const path = require('path');

const DICTIONARY_PATH = path.join(__dirname, '..', 'lib', 'garhwali_dictionary.json');

const REQUIRED_FIELDS = ['garhwali_word', 'hindi_meaning', 'english_meaning', 'category'];
const VALID_CATEGORIES = ['phrase', 'noun', 'verb', 'adjective', 'adverb', 'song_phrase'];

let errors = [];
let warnings = [];
let info = [];

function log(message) {
  console.log(message);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

function logWarning(message) {
  console.warn(`⚠️  ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function validateDictionary() {
  log('🔍 Validating Garhwali Dictionary...');
  log('');

  // Check file exists
  if (!fs.existsSync(DICTIONARY_PATH)) {
    logError('Dictionary file not found!');
    process.exit(1);
  }

  // Read dictionary
  let dictionary;
  try {
    const content = fs.readFileSync(DICTIONARY_PATH, 'utf-8');
    dictionary = JSON.parse(content);
  } catch (error) {
    logError(`Failed to parse dictionary JSON: ${error.message}`);
    process.exit(1);
  }

  // Validate structure
  if (!Array.isArray(dictionary)) {
    logError('Dictionary must be an array!');
    process.exit(1);
  }

  info.push(`Total entries: ${dictionary.length}`);

  // Track stats
  const categoryCount = {};
  const duplicateWords = new Set();

  // Validate each entry
  dictionary.forEach((entry, index) => {
    const entryNum = index + 1;

    // Check required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!entry[field]) {
        errors.push(`Entry ${entryNum}: Missing required field "${field}"`);
      } else if (typeof entry[field] !== 'string') {
        errors.push(`Entry ${entryNum}: Field "${field}" must be a string`);
      } else if (entry[field].trim() === '') {
        errors.push(`Entry ${entryNum}: Field "${field}" cannot be empty`);
      }
    });

    // Check category validity
    if (entry.category && !VALID_CATEGORIES.includes(entry.category)) {
      errors.push(`Entry ${entryNum}: Invalid category "${entry.category}". Valid categories: ${VALID_CATEGORIES.join(', ')}`);
    }

    // Track category stats
    if (entry.category) {
      categoryCount[entry.category] = (categoryCount[entry.category] || 0) + 1;
    }

    // Check for duplicates
    if (entry.garhwali_word) {
      const word = entry.garhwali_word.toLowerCase().trim();
      if (duplicateWords.has(word)) {
        warnings.push(`Entry ${entryNum}: Duplicate word "${entry.garhwali_word}"`);
      }
      duplicateWords.add(word);
    }

    // Check for Devanagari script (soft warning)
    if (entry.garhwali_word && !/[\u0900-\u097F]/.test(entry.garhwali_word)) {
      warnings.push(`Entry ${entryNum}: "${entry.garhwali_word}" doesn't appear to use Devanagari script`);
    }

    // Check usage example format
    if (entry.usage_example && entry.usage_example.length > 500) {
      warnings.push(`Entry ${entryNum}: Usage example is quite long (>500 chars)`);
    }
  });

  // Print stats
  log('📊 Dictionary Statistics:');
  log('');
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      const percentage = ((count / dictionary.length) * 100).toFixed(1);
      log(`   ${category}: ${count} (${percentage}%)`);
    });
  log('');

  // Print info
  info.forEach(logInfo);
  log('');

  // Print warnings
  if (warnings.length > 0) {
    log('⚠️  Warnings:');
    warnings.forEach(logWarning);
    log('');
  }

  // Print errors
  if (errors.length > 0) {
    log('❌ Errors:');
    errors.forEach(logError);
    log('');
    logError(`Found ${errors.length} error(s) in the dictionary.`);
    process.exit(1);
  }

  // Success
  logSuccess(`Dictionary validation passed! (${dictionary.length} entries)`);

  if (warnings.length > 0) {
    log('');
    logWarning(`${warnings.length} warning(s) found - review recommended`);
  }

  process.exit(0);
}

// Run validation
validateDictionary();
