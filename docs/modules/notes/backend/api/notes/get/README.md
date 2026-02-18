# GET /api/notes

List all user's notes with metadata (no full content)

**Module:** `notes`  
**Route:** `GET /api/notes`  
**Implementation Path:** `api/notes.get.ts` or `api/notes/index.get.ts`  
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Retrieve list of authenticated user's notes with metadata for sidebar display (excludes full content for performance)

### Business Context

Called on page load to populate notes sidebar. Returns minimal data needed for list view: id, title, position, timestamps. User clicks note to fetch full content via GET /api/notes/:id

---

## Route

**Path Pattern:** `GET /api/notes`

**Path Parameters:** None

**Query Parameters:** None

---

## HTTP Method

**Method:** GET

**Idempotency:** Idempotent (same request always returns same data)

**Safe:** Yes (read-only, no state modification)

---

## Authorization

**Access Level:** authenticated

**Authorization Rules:**
- User must have valid session token (Authorization header)
- Can only retrieve own notes (filtered by userId from session)
- Returns 401 Unauthorized if session invalid

**Headers Required:**
- `Authorization`: Bearer token from authentication system

---

## Request Contract

### Headers

**Required:**
- `Authorization`: Bearer {jwt_token}

**Example Request:**

```http
GET /api/notes
Authorization: Bearer eyJhbGc...
```

---

## Response Contract

### Success Response

**Status Code:** `200 OK`

**Schema:**

```json
{
  "data": [
    {
      "id": "Integer — Note ID",
      "title": "String — Note title",
      "position": "Integer — Position in user's list",
      "createdAt": "ISO8601 — Creation timestamp",
      "updatedAt": "ISO8601 — Last update timestamp"
    }
  ],
  "meta": {
    "total": "Integer — Total count of user's notes"
  }
}
```

**Example Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "id": 1,
      "title": "Meeting Notes",
      "position": 1,
      "createdAt": "2026-02-14T10:00:00Z",
      "updatedAt": "2026-02-14T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Untitled",
      "position": 2,
      "createdAt": "2026-02-14T09:00:00Z",
      "updatedAt": "2026-02-14T09:00:00Z"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

**Empty Response (no notes):**

```json
{
  "data": [],
  "meta": {
    "total": 0
  }
}
```

---

## Business Rules

1. **User isolation**: Only return notes owned by authenticated user (WHERE userId = session.userId)
2. **Metadata only**: Exclude `content` field for performance (content loaded on demand via GET /api/notes/:id)
3. **Position ordering**: Always return notes sorted by position ASC (drag-to-reorder determines position)
4. **No pagination**: Return all notes in single response (max 500 even on Max plan is manageable for JSON response)
5. **Always succeed**: Empty array if user has no notes (not an error condition)

---

## Validation Rules

**No Request Validation:**
- Endpoint accepts no inputs beyond authentication token

---

## Error Scenarios

### 401 Unauthorized

**When:**
- Missing Authorization header
- Invalid or expired session token

**Response:**

```json
{
  "statusCode": 401,
  "message": "Valid authentication required"
}
```

### 500 Internal Server Error

**When:**
- Database connection failure
- Unexpected server error

**Response:**

```json
{
  "statusCode": 500,
  "message": "Failed to retrieve notes. Please try again."
}
```

---

## Side Effects

**Database Writes:**
- None (read-only operation)

**Events Triggered:**
- None

**Cache:**
- Response cached with key `notes:user:{userId}:list`
- Cache TTL: 60 seconds
- Invalidated on: note creation, deletion, position update, title/content update

**External API Calls:**
- None

---

## Edge Cases

**User with 0 Notes:**
- Returns empty array with total: 0, not an error

**Large Note Count (500+ on Max Plan):**
- Returns all notes (no pagination)
- Response size ~50KB for 500 notes (metadata only)

**Concurrent Updates:**
- May return stale data if note updated during request
- Client refreshes on note content fetch if updatedAt differs

**Missing Position Values:**
- Should not occur (position required on creation)
- If data integrity issue, order by id DESC as fallback

---

## Performance Considerations

**Rate Limiting:**
- Authenticated users: 100 requests per minute per user
- Exceeding limit → 429 Too Many Requests

**Timeout:**
- Request timeout: 5 seconds
- Database query timeout: 2 seconds

**Expected Response Time:**
- p50: <50ms
- p95: <100ms
- p99: <200ms

**Caching:**
- Response cached for 60 seconds per user
- Cache invalidated on any note mutation

**Database Query Optimization:**
- Index on (userId, position) for fast ordered retrieval
- SELECT excludes `content` field (reduces transfer size)

**Response Size:**
- ~100 bytes per note (metadata only)
- Max response ~50KB for 500 notes

---

## Integration Points

**Called By:**
- Frontend Notes module: On /notes page load to populate sidebar

**Depends On:**
- Auth module: Session validation and userId extraction
- Notes database: `note` table read

**Triggers:**
- None (read-only)

---

## Testing Guidance

**Key Test Scenarios:**
1. User with 0 notes → empty array
2. User with 1 note → array with 1 item
3. User with 50 notes → array with 50 items, ordered by position ASC
4. Response excludes content field
5. Response includes id, title, position, timestamps
6. Meta.total matches array length
7. Authorization errors (missing token, invalid token)
8. Cache behavior (second request hits cache)
9. Cache invalidation (create note, then list shows new note)

**Edge Cases to Test:**
- User with Max plan and 500 notes → all returned
- Notes with Unicode titles
- Notes with position gaps (1, 3, 5) → returned in position order
- Concurrent list requests → both succeed with same data
