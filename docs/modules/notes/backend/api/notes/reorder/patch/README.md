# PATCH /api/notes/reorder

Batch update note positions for drag-to-reorder

**Module:** `notes`  
**Route:** `PATCH /api/notes/reorder`  
**Implementation Path:** `api/notes/reorder.patch.ts` or `api/notes/reorder/index.patch.ts`  
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Update positions of multiple notes in single transaction for drag-to-reorder functionality

### Business Context

Triggered when user drags note to new position in sidebar. Frontend calculates new positions for affected notes, sends batch update to maintain consistent ordering

---

## Route

**Path Pattern:** `PATCH /api/notes/reorder`

**Path Parameters:** None

**Query Parameters:** None

---

## HTTP Method

**Method:** PATCH

**Idempotency:** Idempotent (applying same position updates multiple times produces same final state)

**Safe:** No (modifies resource positions)

---

## Authorization

**Access Level:** authenticated

**Authorization Rules:**
- User must have valid session token (Authorization header)
- All note IDs in request must be owned by authenticated user
- Returns 401 Unauthorized if session invalid
- Returns 403 Forbidden if any note ID not owned by user

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
  "updates": [
    {
      "id": "Integer — Note ID",
      "position": "Integer — New position"
    }
  ]
}
```

**Validation Constraints:**
- `updates`: Required array, min 1 item, max 500 items (covers Max plan limit)
- `id`: Required integer, must be positive, must reference note owned by user
- `position`: Required integer, must be positive (>= 1)

**Example Request:**

```http
PATCH /api/notes/reorder
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "updates": [
    { "id": 5, "position": 1 },
    { "id": 3, "position": 2 },
    { "id": 1, "position": 3 }
  ]
}
```

**Explanation:** User dragged note 5 to top position, shifting notes 3 and 1 down

---

## Response Contract

### Success Response

**Status Code:** `200 OK`

**Schema:**

```json
{
  "updated": "Integer — Number of notes updated",
  "positions": [
    {
      "id": "Integer — Note ID",
      "position": "Integer — New position"
    }
  ]
}
```

**Example Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "updated": 3,
  "positions": [
    { "id": 5, "position": 1 },
    { "id": 3, "position": 2 },
    { "id": 1, "position": 3 }
  ]
}
```

---

## Business Rules

1. **User isolation**: All note IDs must be owned by authenticated user (reject entire batch if ANY note not owned)
2. **Atomic transaction**: All position updates succeed or all fail (no partial updates)
3. **Ownership verification**: Verify all note IDs exist and owned by user before updating any positions
4. **Position uniqueness**: Positions within user's notes should be unique after update (frontend's responsibility to calculate correctly)
5. **updatedAt unchanged**: Reordering does NOT update updatedAt timestamp (not content change)
6. **Only updates provided**: Notes not in updates array keep their current positions

---

## Validation Rules

**Updates Array:**
- Type: Array of objects
- Min length: 1 (must update at least one note)
- Max length: 500 (practical limit for Max plan users)
- If empty array → 422 Unprocessable Entity with error: "Must provide at least one note to reorder"
- If > 500 items → 422 Unprocessable Entity with error: "Cannot reorder more than 500 notes at once"

**ID Field:**
- Type: Integer
- Must be positive (>= 1)
- Must reference existing note
- If not integer → 422 Unprocessable Entity
- If negative/zero → 422 Unprocessable Entity
- If doesn't exist → 403 Forbidden with error: "Note not found: {id}"
- If owned by different user → 403 Forbidden with error: "Note not found: {id}" (don't leak existence)

**Position Field:**
- Type: Integer
- Must be positive (>= 1)
- If not integer → 422 Unprocessable Entity
- If negative/zero → 422 Unprocessable Entity

**Duplicate IDs:**
- If same ID appears multiple times in updates array → 422 Unprocessable Entity with error: "Duplicate note ID: {id}"

---

## Error Scenarios

### 400 Bad Request

**When:**
- Invalid JSON body
- Missing required fields

**Response:**

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

### 403 Forbidden

**When:**
- Any note ID in updates array not owned by authenticated user
- Note ID exists but owned by different user
- Note ID doesn't exist

**Response:**

```json
{
  "statusCode": 403,
  "message": "Note not found: 42"
}
```

**Note:** Same error whether note doesn't exist or not owned (don't leak existence)

### 422 Unprocessable Entity

**When:**
- Empty updates array
- More than 500 items in updates array
- Invalid ID or position (not integer, negative, zero)
- Duplicate note IDs in updates array
- Missing id or position field

**Response:**

```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "updates[0].position",
      "message": "Position must be a positive integer"
    }
  ]
}
```

Or:

```json
{
  "statusCode": 422,
  "message": "Must provide at least one note to reorder"
}
```

Or:

```json
{
  "statusCode": 422,
  "message": "Duplicate note ID: 42"
}
```

### 500 Internal Server Error

**When:**
- Database connection failure
- Transaction rollback failure
- Unexpected server error

**Response:**

```json
{
  "statusCode": 500,
  "message": "Failed to reorder notes. Please try again."
}
```

---

## Side Effects

**Database Writes:**
- Updates `position` field for multiple rows in `note` table within single transaction
- Does NOT update `updatedAt` timestamp (reordering is not content change)

**Events Triggered:**
- None (future: could emit `notes.reordered` event)

**Cache Invalidation:**
- Invalidates user's note list cache: `notes:user:{userId}:list`
- Individual note caches unchanged (position stored in list cache)

**External API Calls:**
- None

---

## Edge Cases

**Reorder Single Note:**
- Valid, updates position for 1 note
- Other notes' positions unchanged

**Non-Sequential Positions:**
- Frontend may send positions 1, 3, 5, 7 (gaps allowed)
- Server accepts as-is, doesn't enforce sequential positions

**Position Collisions:**
- If updates create duplicate positions (e.g., two notes at position 5), accepted
- Frontend's responsibility to calculate non-overlapping positions

**Update to Same Position:**
- Idempotent, no error

**Large Batch (500 Notes):**
- Valid for Max plan users with many notes
- Transaction handles atomically

**Rapid Reordering:**
- User drags multiple notes quickly
- Client debounces, sends final positions in single batch

---

## Performance Considerations

**Rate Limiting:**
- Authenticated users: 100 requests per minute per user
- Exceeding limit → 429 Too Many Requests
- Frontend debounces reorder events to reduce request volume

**Timeout:**
- Request timeout: 10 seconds (larger batch updates)
- Database transaction timeout: 5 seconds

**Expected Response Time:**
- p50: <200ms (small batches, 1-10 notes)
- p95: <500ms (medium batches, 10-100 notes)
- p99: <1000ms (large batches, 100-500 notes)

**Database Query Complexity:**
- Batch UPDATE in single transaction
- WHERE id IN (...) AND userId = :userId
- Indexed on (id, userId) for fast ownership verification

**Transaction Isolation:**
- Serializable transaction to prevent concurrent reorder conflicts

---

## Integration Points

**Called By:**
- Frontend Notes module: When user drags note to new position in sidebar

**Depends On:**
- Auth module: Session validation and userId extraction
- Notes database: `note` table batch update

**Triggers:**
- None (position-only update)

---

## Testing Guidance

**Key Test Scenarios:**
1. Reorder 3 notes → 200 with updated positions
2. Reorder single note → 200 with 1 position updated
3. Reorder 500 notes (Max plan) → 200 with all updated
4. All note IDs owned by user → 200
5. One note ID not owned by user → 403 Forbidden (atomic rejection)
6. Authorization errors (missing token, invalid token)
7. Validation errors (empty array, duplicate IDs, invalid positions)
8. Cache invalidation (reorder, then GET list shows new order)

**Edge Cases to Test:**
- Non-sequential positions (1, 3, 5) → 200 accepted
- Position collisions (two notes at position 5) → 200 accepted
- Update to same position (idempotent) → 200
- Reorder note to position 1 (top) → 200
- Reorder note to high position (1000) → 200
- Empty updates array → 422
- 501 notes in updates array → 422
- Duplicate note ID in array → 422
- Negative position → 422
- Position = 0 → 422
- Non-integer position → 422
