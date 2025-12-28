# API Documentation

This document describes the API endpoints available in Garhwali Seva.

## Base URL

| Environment | URL |
|-------------|-----|
| Production | `https://your-domain.com/api` |
| Development | `http://localhost:3000/api` |

---

## Endpoints

### Health Check

**GET** `/api/health`

Check if the application is running.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "version": "1.0.0",
  "environment": "production"
}
```

**Status Codes:**

| Code | Description |
|------|-------------|
| 200 | Service is healthy |
| 503 | Service is unhealthy |

---

### Submit Contribution

**POST** `/api/contributions/submit`

Submit a new word or phrase to the dictionary.

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "garhwali_word": "string (required)",
  "hindi_meaning": "string (required)",
  "english_meaning": "string (required)",
  "usage_example": "string (optional)",
  "category": "string (required)",
  "email": "string (optional)"
}
```

**Field Validation:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `garhwali_word` | string | Yes | 1-100 characters, Devanagari script |
| `hindi_meaning` | string | Yes | 1-100 characters |
| `english_meaning` | string | Yes | 1-100 characters |
| `usage_example` | string | No | 0-500 characters |
| `category` | string | Yes | Must be: phrase, noun, verb, adjective, song_phrase |
| `email` | string | No | Valid email format |

**Example Request:**

```bash
curl -X POST https://your-domain.com/api/contributions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "garhwali_word": "Naya Saal",
    "hindi_meaning": "नया साल",
    "english_meaning": "New Year",
    "usage_example": "Naya Saal mubarak ho!",
    "category": "phrase",
    "email": "contributor@example.com"
  }'
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Contribution submitted successfully",
  "data": {
    "id": "contribution_abc123",
    "status": "pending_review"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "category",
      "message": "Invalid category value"
    }
  ]
}
```

**Error Response (500):**

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to submit contribution"
}
```

---

### Dictionary Stats

**GET** `/api/dictionary/stats`

Get statistics about the dictionary.

**Response:**

```json
{
  "total_entries": 150,
  "categories": {
    "phrase": 15,
    "noun": 60,
    "verb": 30,
    "adjective": 35,
    "song_phrase": 5
  },
  "last_updated": "2025-01-15T10:00:00Z"
}
```

---

### Test Translation

**POST** `/api/translate/test`

Test a translation (for development purposes).

**Request Body:**

```json
{
  "text": "string (required)",
  "target_lang": "hindi | english"
}
```

**Response:**

```json
{
  "input": "Namaste",
  "translation": "नमस्ते",
  "target_lang": "hindi",
  "metadata": {
    "totalWords": 1,
    "translatedWords": 1,
    "untranslatedWords": 0,
    "translationRate": 1
  }
}
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST `/api/contributions/submit` | 10 requests | 15 minutes |
| GET endpoints | 100 requests | 1 minute |

**Rate Limit Headers:**

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1705315800
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Webhooks

### Contribution Notification (Future)

Receive notifications when contributions are submitted:

```json
{
  "event": "contribution.submitted",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "id": "contribution_abc123",
    "word": "Naya Saal"
  }
}
```

---

## SDKs

### JavaScript/TypeScript

```typescript
import { GarhwaliAPI } from '@garhwaliseva/api';

const api = new GarhwaliAPI({
  baseUrl: 'https://your-domain.com/api'
});

const health = await api.healthCheck();
const contribution = await api.submitContribution({
  garhwali_word: 'Namaste',
  hindi_meaning: 'नमस्ते',
  english_meaning: 'Hello',
  category: 'phrase'
});
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-15 | Initial release |

---

## Support

For API issues:
- Check [Troubleshooting Guide](DEPLOYMENT.md#troubleshooting)
- Open [GitHub Issue](https://github.com/yourusername/garhwali-seva/issues)
