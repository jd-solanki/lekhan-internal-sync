# PATCH /api/notes/:id

Update note title and/or content (auto-save endpoint)

**Module:** `notes`  
**Route:** `PATCH /api/notes/:id`  
**Implementation Path:** `api/notes/[id].patch.ts` or `api/notes/[id]/index.patch.ts`  
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Partially update note title or content for authenticated user, enforcing ownership and validation

### Business Context

Auto-save endpoint triggered every 3 seconds after user stops typing. Accepts partial updates (title only, content only, or both). Core UX relies on this for "save-less" editing experience

---

## Route

**Path Pattern:** `PATCH /api/notes/:id`

**Path Parameters:**
- `id`: Integer, must reference note owned by authenticated user

**Query Parameters:** None

---

## HTTP Method

**Method:** PATCH

**Idempotency:** Idempotent (same update applied multiple times has same result as once)

**Safe:** No (modifies resource state)

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
- `Content-Type`: application/json

### Request Body

**Schema:**

```json
{
  "title": "String? — Optional title, max 255 chars",
  "content": "String? — Optional content, max 100KB, warn at 90KB"
}
```

**Validation Constraints:**
- At least one field (title or content) must be provided
- `title`: Optional, max 255 chars, cannot be empty string (use "Untitled" if clearing)
- `content`: Optional, max 100KB (102400 bytes), can be empty string

**Example Request:**

```http
PATCH /api/notes/42
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "title": "Updated Meeting Notes"
}
```

Or update content only:

```json
{
  "content": "# New Content\n\nUpdated markdown..."
}
```

Or both:

```json
{
  "title": "Final Notes",
  "content": "# Conclusion\n\nAll done!"
}
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
  "title": "String — Updated title",
  "content": "String — Updated content",
  "position": "Integer — Position (unchanged)",
  "createdAt": "ISO8601 — Creation timestamp (unchanged)",
  "updatedAt": "ISO8601 — New update timestamp"
}
```

**Example Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 42,
  "userId": 123,
  "title": "Updated Meeting Notes",
  "content": "# Agenda\n\n- Review timeline",
  "position": 1,
  "createdAt": "2026-02-14T10:00:00Z",
  "updatedAt": "2026-02-14T11:45:00Z"
}
```

---

## Business Rules

1. **User isolation**: Only update note if owned by authenticated user (WHERE id = :id AND userId = session.userId)
2. **Partial updates**: Only update fields provided in request body (don't reset omitted fields)
3. **updatedAt auto-update**: Set updatedAt to current timestamp on every successful update
4. **Position unchanged**: PATCH does not modify position (use PATCH /api/notes/reorder for position changes)
5. **Markdown only**: Content stored as markdown, no HTML in database
6. **Non-empty title**: Title cannot be empty string, must have at least 1 non-whitespace character or default to "Untitled"
7. **90KB warning threshold**: Frontend warns user at 90KB content (90% of 100KB limit), but server allows up to 100KB

---

## Validation Rules

**Title:**
- Type: String or undefined (omit if not updating)
- Max length: 255 characters
- Cannot be empty string (trim whitespace, if empty → reject)
- If longer than 255 → 422 Unprocessable Entity with error: "Title must be 255 characters or less"
- If empty string → 422 Unprocessable Entity with error: "Title cannot be empty. Use 'Untitled' if needed."

**Content:**
- Type: String or undefined (omit if not updating)
- Max length: 100KB (102400 bytes)
- Can be empty string ""
- If longer than 100KB → 422 Unprocessable Entity with error: "Content exceeds 100KB limit"

**At Least One Field:**
- Must provide at least `title` or `content`
- If empty body {} → 422 Unprocessable Entity with error: "Must provide title or content to update"

---

## Error Scenarios

### 400 Bad Request

**When:**
- Invalid JSON body
- ID parameter not an integer

**Response:**

```json
{
  "statusCode": 400,
  "message": "Invalid note ID format"
}
```

Or:

```json
{
  "statusCode": 400,
  "message": "Invalid JSON body"
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

### 422 Unprocessable Entity

**When:**
- Title exceeds 255 chars
- Title is empty string
- Content exceeds 100KB
- No fields provided in request body

**Response:**

```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be 255 characters or less"
    }
  ]
}
```

Or:

```json
{
  "statusCode": 422,
  "message": "Must provide title or content to update"
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
  "message": "Failed to update note. Please try again."
}
```

---

## Side Effects

**Database Writes:**
- Updates row in `note` table with new title/content and updatedAt timestamp
- Only updates provided fields (partial update)

**Events Triggered:**
- None (future: could emit `note.updated` event)

**Cache Invalidation:**
- Invalidates user's note list cache: `notes:user:{userId}:list`
- Invalidates specific note cache: `notes:user:{userId}:note:{id}`

**External API Calls:**
- None

---

## Edge Cases

**Empty Content:**
- Valid, content can be empty string ""

**Whitespace-Only Title:**
- Trimmed before validation, if empty after trim → reject with 422

**Update Title to Same Value:**
- Idempotent, updates updatedAt timestamp anyway

**Rapid Auto-Save:**
- Multiple PATCH requests within 3 seconds (debounce handled client-side)
- Server processes each request independently

**Large Content Near Limit:**
- 90KB warning shown client-side (not server concern)
- Server rejects only at 100KB+ (102401 bytes)

**Unicode Content:**
- Supports full Unicode (emoji, non-Latin scripts)
- 100KB limit applies to UTF-8 byte count, not character count

**Concurrent Updates:**
- Last write wins (no conflict resolution, no optimistic locking)
- updatedAt reflects most recent update

---

## Performance Considerations

**Rate Limiting:**
- Authenticated users: 100 requests per minute per user
- Exceeding limit → 429 Too Many Requests
- Auto-save debounce (3s client-side) reduces request volume

**Timeout:**
- Request timeout: 5 seconds
- Database update timeout: 3 seconds

**Expected Response Time:**
- p50: <100ms
- p95: <300ms
- p99: <500ms

**Database Query Complexity:**
- Single UPDATE with WHERE id = :id AND userId = :userId
- Indexed lookup on (id, userId) for fast ownership check

---

## Integration Points

**Called By:**
- Frontend Notes module: Auto-save every 3 seconds after user stops typing
- Frontend Notes module: Manual save on title change (separate debounce)

**Depends On:**
- Auth module: Session validation and userId extraction
- Notes database: `note` table update

**Triggers:**
- None (stateless update)

---

## Testing Guidance

**Key Test Scenarios:**
1. Update title only → 200 with updated title, content unchanged
2. Update content only → 200 with updated content, title unchanged
3. Update both title and content → 200 with both updated
4. updatedAt changes on every update
5. createdAt and position unchanged
6. Validation errors (title too long, content too large, empty title)
7. Authorization errors (missing token, invalid token)
8. Ownership errors (update another user's note → 404)
9. Invalid ID parameter
10. Empty request body → 422

**Edge Cases to Test:**
- Empty string content → 200 with content: ""
- Whitespace-only title → 422
- Title 255 chars → 200
- Title 256 chars → 422
- Content 100KB → 200
- Content 100KB + 1 byte → 422
- Unicode content → 200 with Unicode preserved
- Concurrent updates → last write wins
- Idempotent update (same value twice) → 200 both times
