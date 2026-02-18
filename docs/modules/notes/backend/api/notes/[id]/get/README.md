# GET /api/notes/:id

Fetch specific note with full content

**Module:** `notes`  
**Route:** `GET /api/notes/:id`  
**Implementation Path:** `api/notes/[id].get.ts` or `api/notes/[id]/index.get.ts`  
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Retrieve single note with full content and metadata, verifying ownership

### Business Context

Called when user clicks note in sidebar to open editor. Returns complete note data including full markdown content for editing

---

## Route

**Path Pattern:** `GET /api/notes/:id`

**Path Parameters:**
- `id`: Integer, must reference note owned by authenticated user

**Query Parameters:** None

---

## HTTP Method

**Method:** GET

**Idempotency:** Idempotent (same request always returns same note)

**Safe:** Yes (read-only, no state modification)

---

## Authorization

**Access Level:** authenticated

**Authorization Rules:**
- User must have valid session token (Authorization header)
- Note must be owned by authenticated user (userId from session)
- Returns 401 Unauthorized if session invalid
- Returns 404 Not Found if note doesn't exist OR not owned (don't leak existence)

**Headers Required:**
- `Authorization`: Bearer token from authentication system

---

## Request Contract

### Headers

**Required:**
- `Authorization`: Bearer {jwt_token}

### Path Parameters

**id:**
- Type: Integer
- Validation: Must be positive integer
- Example: `42`

**Example Request:**

```http
GET /api/notes/42
Authorization: Bearer eyJhbGc...
```

---

## Response Contract

### Success Response

**Status Code:** `200 OK`

**Schema:**

```json
{
  "id": "Integer — Note ID",
  "userId": "Integer — Owner user ID",
  "title": "String — Note title",
  "content": "String — Full markdown content",
  "position": "Integer — Position in user's list",
  "createdAt": "ISO8601 — Creation timestamp",
  "updatedAt": "ISO8601 — Last update timestamp"
}
```

**Example Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json
ETag: "1707905400"

{
  "id": 42,
  "userId": 123,
  "title": "Meeting Notes",
  "content": "# Agenda\n\n- Review project timeline\n- Discuss budget\n- Next steps",
  "position": 1,
  "createdAt": "2026-02-14T10:00:00Z",
  "updatedAt": "2026-02-14T10:30:00Z"
}
```

**Headers:**
- `ETag`: Timestamp of updatedAt for caching (Unix timestamp)

---

## Business Rules

1. **User isolation**: Only return note if owned by authenticated user (WHERE id = :id AND userId = session.userId)
2. **Full content**: Include complete markdown content (unlike GET /api/notes which excludes content)
3. **Ownership verification**: 404 if note exists but owned by different user (don't leak existence)
4. **404 for not found**: 404 if note ID doesn't exist in database
5. **No soft delete**: Deleted notes return 404 (permanent deletion, no trash)

---

## Validation Rules

**ID Parameter:**
- Type: Integer
- Must be positive integer (>= 1)
- If not integer → 400 Bad Request with error: "Invalid note ID format"
- If negative/zero → 400 Bad Request with error: "Invalid note ID"

---

## Error Scenarios

### 400 Bad Request

**When:**
- ID parameter not an integer
- ID parameter negative or zero

**Response:**

```json
{
  "statusCode": 400,
  "message": "Invalid note ID format"
}
```

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

### 404 Not Found

**When:**
- Note ID doesn't exist in database
- Note exists but owned by different user (don't leak existence)

**Response:**

```json
{
  "statusCode": 404,
  "message": "Note not found"
}
```

**Note:** Same response whether note doesn't exist or user doesn't own it (security: don't leak note existence)

### 500 Internal Server Error

**When:**
- Database connection failure
- Unexpected server error

**Response:**

```json
{
  "statusCode": 500,
  "message": "Failed to retrieve note. Please try again."
}
```

---

## Side Effects

**Database Writes:**
- None (read-only operation)

**Events Triggered:**
- None

**Cache:**
- Response cached with key `notes:user:{userId}:note:{id}`
- Cache TTL: 300 seconds (5 minutes)
- Invalidated on: note update (PATCH), note deletion (DELETE)

**External API Calls:**
- None

---

## Edge Cases

**Large Content:**
- Content up to 100KB returned fully
- No truncation or pagination

**Unicode Content:**
- Markdown content with emoji, non-Latin scripts returned as-is

**Empty Content:**
- Empty string content returned (valid state)

**Recently Updated:**
- updatedAt reflects last PATCH, used for ETag caching

**Concurrent Updates:**
- May return stale data if updated during request
- Client checks ETag on subsequent requests

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
- p95: <150ms
- p99: <300ms

**Caching:**
- Response cached for 5 minutes per note
- ETag header enables conditional requests (304 Not Modified)
- Cache invalidated on note update or deletion

**Database Query Optimization:**
- Primary key lookup (id) with userId filter
- Index on (id, userId) for fast lookup

**Response Size:**
- Typical: 1-10KB (with content)
- Max: ~100KB (max content size)

---

## Integration Points

**Called By:**
- Frontend Notes module: When user clicks note in sidebar to open editor

**Depends On:**
- Auth module: Session validation and userId extraction
- Notes database: `note` table read

**Triggers:**
- None (read-only)

---

## Testing Guidance

**Key Test Scenarios:**
1. Fetch existing note owned by user → 200 with full content
2. Fetch note with large content (100KB) → 200 with full content
3. Fetch note owned by different user → 404 Not Found
4. Fetch non-existent note ID → 404 Not Found
5. Authorization errors (missing token, invalid token)
6. Invalid ID parameter (non-integer, negative)
7. Cache behavior (second request hits cache)
8. ETag header present in response
9. Unicode content returned correctly

**Edge Cases to Test:**
- Empty content note → 200 with content: ""
- Note with very long title (255 chars) → 200 with full title
- Recently created note → 200 with fresh data
- Note updated by PATCH → cache invalidated, returns updated content
- Note deleted by DELETE → 404 Not Found
