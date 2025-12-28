# Garhwali Dictionary Guide

This document explains the structure, format, and guidelines for the Garhwali translation dictionary.

## Dictionary Structure

The dictionary is stored in `lib/garhwali_dictionary.json` as a JSON array of entries.

### Entry Format

```json
{
  "garhwali_word": "string (required)",
  "hindi_meaning": "string (required)",
  "english_meaning": "string (required)",
  "usage_example": "string (optional)",
  "category": "string (required)"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `garhwali_word` | string | Yes | The Garhwali word or phrase in Devanagari script |
| `hindi_meaning` | string | Yes | Hindi translation in Devanagari script |
| `english_meaning` | string | Yes | English translation |
| `usage_example` | string | No | Example sentence showing usage context |
| `category` | string | Yes | Category classification (see below) |

### Categories

| Category | Description | Example |
|----------|-------------|---------|
| `phrase` | Complete phrases or greetings | "Namaste" (नमस्ते) |
| `noun` | People, places, things | "Ghar" (घर) |
| `verb` | Action words | "Karna" (करना) |
| `adjective` | Descriptive words | "Accha" (अच्छा) |
| `song_phrase` | Song-specific phrases | Traditional song lines |

## Adding New Entries

### Format Requirements

1. **Spelling**: Use standard Garhwali spelling in Devanagari script
2. **Script**: All words must be in Devanagari script (not Latin transliteration)
3. **Tone**: Use neutral, standard form (not regional dialect)
4. **Accuracy**: Verify translations with native speakers

### Example Entry

```json
{
  "garhwali_word": "Kitab",
  "hindi_meaning": "किताब",
  "english_meaning": "Book",
  "usage_example": "Mujhe ek kitab chahiye.",
  "category": "noun"
}
```

### Validating Entries

Run the validation script to check your entries:

```bash
npm run validate-dictionary lib/garhwali_dictionary.json
```

## Translation Priorities

The translation engine uses a **priority system**:

1. **Highest**: Phrase-level matches (exact phrase lookup)
2. **High**: Song phrases (song-specific terminology)
3. **Medium**: Nouns (most common category)
4. **Standard**: Verbs and adjectives

## Dictionary Statistics

### Current Coverage

| Category | Count | Percentage |
|----------|-------|------------|
| Phrases | 15+ | 10% |
| Nouns | 60+ | 40% |
| Verbs | 30+ | 20% |
| Adjectives | 35+ | 23% |
| Song Phrases | 5+ | 3% |
| **Total** | **150+** | **100%** |

### Coverage Goals

| Milestone | Target Words | Timeline |
|-----------|--------------|----------|
| MVP | 100+ | Done ✓ |
| Q1 2025 | 500+ | In Progress |
| Q2 2025 | 1,000+ | Planned |
| Q4 2025 | 2,500+ | Long-term |

## Quality Guidelines

### Translation Accuracy

- ✅ Verify meanings with native Garhwali speakers
- ✅ Use standard Devanagari spelling
- ✅ Include context in usage examples
- ✅ Cross-reference with existing dictionary

### Common Mistakes to Avoid

1. **Script Mixing**: Don't mix Devanagari with Latin script
2. **Regional Dialects**: Avoid region-specific words
3. **Spelling Errors**: Double-check Devanagari spelling
4. **Incorrect Context**: Match category to word type

## Batch Import Format

For large batch imports, use this JSON format:

```json
[
  {
    "garhwali_word": "Word1",
    "hindi_meaning": "Hindi1",
    "english_meaning": "English1",
    "category": "noun"
  },
  {
    "garhwali_word": "Word2",
    "hindi_meaning": "Hindi2",
    "english_meaning": "English2",
    "category": "verb"
  }
]
```

## API Integration

The dictionary is loaded at build time for performance. No runtime API calls are needed for translations.

### Loading the Dictionary

```typescript
import dictionaryData from '@/lib/garhwali_dictionary.json';

// Access entries
const entries = dictionaryData as DictionaryEntry[];
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review pending contributions
2. **Monthly**: Validate dictionary format
3. **Quarterly**: Review accuracy with community
4. **Annually**: Full dictionary audit

### Reporting Issues

If you find:
- **Spelling errors**: Open a GitHub issue
- **Translation errors**: Use the contribute page
- **Missing words**: Submit via contribute page

## Future Enhancements

Planned dictionary features:

1. [ ] Multi-level categorization (animal, plant, etc.)
2. [ ] Dialect mapping (Kumaoni, etc.)
3. [ ] Synonym support
4. [ ] Antonym support
5. [ ] Regional variant flags
6. [ ] Audio pronunciation links

---

For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).
