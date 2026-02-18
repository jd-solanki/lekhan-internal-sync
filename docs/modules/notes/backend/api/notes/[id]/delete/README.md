# DELETE /api/notes/:id

Permanently delete note (no recovery)

**Module:** `notes`  
**Route:** `DELETE /api/notes/:id`  
**Implementation Path:** `api/notes/[id].delete.ts` or `api/notes/[id]/index.delete.ts`  
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Permanently delete note owned by authenticated user (hard delete, no trash or recovery)

### Business Context

Triggered when user confirms deletion in UI. No soft delete or trash functionality — deletion is immediate and irreversible per product philosophy

---

## Route

**Path Pattern:** `DELETE /api/notes/:id`

**Path Parameters:**
- `id`: Integer, must reference note owned by authenticated user

**Query Parameters:** None

---

## HTTP Method

**Method:** DELETE

**Idempotency:** Idempotent (deleting same note multiple times has same result — note doesn't exist)

**Safe:** No (modifies state by removing resource)

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
DELETE /api/notes/42
Authorization: Bearer eyJhbGc...
```

---

## Response Contract

### Success Response

**Status Code:** `204 No Content`

**Body:** Empty (no response body for 204)

**Example Response:**

```http
HTTP/1.1 204 No Content
```

---

## Business Rules

1. **User isolation**: Only delete note if owned by authenticated user (WHERE id = :id AND userId = session.userId)
2. **Hard delete**: Permanently remove note from database (no soft delete, no trash, no recovery)
3. **Immediate deletion**: Note deleted in single transaction
4. **No undo**: Once deleted, note cannot be recovered
5. **Unlocks creation**: Deleting note at plan limit immediately allows creating new note
6. **Idempotent**: Deleting already-deleted note returns 404 (same as not-found)

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
- Note already deleted
- Note exists but owned by different user (don't leak existence)

**Response:**

```json
{
  "statusCode": 404,
  "message": "Note not found"
}
```

**Note:** Same response whether note doesn't exist, already deleted, or user doesn't own it (security: don't leak note existence)

### 500 Internal Server Error

**When:**
- Database connection failure
- Unexpected server error

**Response:**

```json
{
  "statusCode": 500,
  "message": "Failed to delete note. Please try again."
}
```

---

## Side Effects

**Database Writes:**
- Permanently deletes row from `note` table (hard delete)
- No cascading deletes (notes are standalone entities)

**Events Triggered:**
- None (future: could emit `note.deleted` event)

**Cache Invalidation:**
- Invalidates user's note list cache: `notes:user:{userId}:list`
- Invalidates specific note cache: `notes:user:{userId}:note:{id}`

**External API Calls:**
- None

**User State Change:**
- User's note count decreases by 1
- If user was at plan limit, can now create new note

---

## Edge Cases

**Delete Same Note Twice:**
- First request: 204 No Content
- Second request: 404 Not Found (idempotent behavior)

**Delete While At Plan Limit:**
- User with 50 notes (Starter plan limit)
- DELETE note → 204 No Content
- POST new note → 201 Created (unlocked)

**Concurrent Deletion:**
- Two simultaneous DELETE requests for same note
- First succeeds (204), second fails (404)

**Delete Non-Existent ID:**
- 404 Not Found (same as "not owned")

**Delete Recently Created Note:**
- Valid, deletes immediately

---

## Performance Considerations

**Rate Limiting:**
- Authenticated users: 100 requests per minute per user
- Exceeding limit → 429 Too Many Requests

**Timeout:**
- Request timeout: 5 seconds
- Database delete timeout: 3 seconds

**Expected Response Time:**
- p50: <50ms
- p95: <150ms
- p99: <300ms

**Database Query Complexity:**
- Single DELETE with WHERE id = :id AND userId = :userId
- Primary key + userId filter (fast indexed lookup)

---

## Integration Points

**Called By:**
- Frontend Notes module: When user confirms deletion in UI

**Depends On:**
- Auth module: Session validation and userId extraction
- Notes database: `note` table delete

**Triggers:**
- None (permanent deletion)

---

## Testing Guidance

**Key Test Scenarios:**
1. Delete existing note owned by user → 204 No Content
2. Delete same note twice → first 204, second 404
3. Delete note owned by different user → 404 Not Found
4. Delete non-existent note ID → 404 Not Found
5. Authorization errors (missing token, invalid token)
6. Invalid ID parameter (non-integer, negative)
7. Cache invalidation (delete, then GET list shows note removed)
8. Plan limit unlocking (delete at limit, then create succeeds)

**Edge Cases to Test:**
- Delete immediately after creation → 204
- Delete while another user owns note with same ID (different users) → 404
- Concurrent deletions of same note → first succeeds, others fail
- Delete note, then fetch via GET → 404
- Delete note at plan limit, then POST new note → 201 Created
