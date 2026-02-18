# POST /api/notes

Create new note for authenticated user

**Module:** `notes`  
**Route:** `POST /api/notes`  
**Implementation Path:** `api/notes.post.ts` or `api/notes/index.post.ts`  
**Last Updated:** 2026-02-14

---

## Overview

### Purpose

Create empty note owned by authenticated user, enforcing subscription plan limits

### Business Context

Triggered when user clicks "New Note" button. Creates note with default title "Untitled" and empty content, assigns max position + 1 for top placement in user's list

---

## Route

**Path Pattern:** `POST /api/notes`

**Path Parameters:** None

**Query Parameters:** None

---

## HTTP Method

**Method:** POST

**Idempotency:** Non-idempotent (each request creates new note)

**Safe:** No (creates resource)

---

## Authorization

**Access Level:** authenticated

**Authorization Rules:**
- User must have valid session token (Authorization header)
- User can only create notes for themselves (userId from session, never from request)
- Returns 401 Unauthorized if session invalid
- Returns 403 Forbidden if at plan limit (Starter: 50, Pro: 200, Max: unlimited)

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
  "title": "String? — Optional title, max 255 chars, defaults to 'Untitled'",
  "content": "String? — Optional content, defaults to empty string"
}
```

**Validation Constraints:**
- `title`: Optional, max 255 chars, defaults to "Untitled"
- `content`: Optional, max 100KB (102400 bytes), defaults to ""

**Example Request:**

```http
POST /api/notes
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{}
```

Or with initial content:

```json
{
  "title": "Meeting Notes",
  "content": "# Agenda\n- Review timeline"
}
```

---

## Response Contract

### Success Response

**Status Code:** `201 Created`

**Schema:**

```json
{
  "id": "Integer — New note ID",
  "userId": "Integer — Owner user ID",
  "title": "String — Note title",
  "content": "String — Note content",
  "position": "Integer — Position in user's list",
  "createdAt": "ISO8601 — Creation timestamp",
  "updatedAt": "ISO8601 — Last update timestamp"
}
```

**Example Response:**

```json
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/notes/42

{
  "id": 42,
  "userId": 123,
  "title": "Untitled",
  "content": "",
  "position": 1,
  "createdAt": "2026-02-14T10:30:00Z",
  "updatedAt": "2026-02-14T10:30:00Z"
}
```

**Headers:**
- `Location`: /api/notes/{id}

---

## Business Rules

1. **User isolation**: Notes created for authenticated user only (userId from session, never request body)
2. **Plan limit enforcement**: Check user's plan before creation (Starter: 50, Pro: 200, Max: unlimited). Count ALL user's notes, reject if at/over limit
3. **Position auto-assignment**: New note position = max(position) + 1 of user's existing notes, or 1 if no notes
4. **Default values**: title defaults to "Untitled", content defaults to empty string if not provided
5. **Active subscription required**: User must have active subscription (trial or paid) to create notes
6. **Markdown only**: Content stored as markdown, no HTML in database

---

## Validation Rules

**Title:**
- Type: String or null/undefined
- Max length: 255 characters
- If longer → 422 Unprocessable Entity with error: "Title must be 255 characters or less"
- If omitted/null → use default "Untitled"

**Content:**
- Type: String or null/undefined
- Max length: 100KB (102400 bytes)
- If longer → 422 Unprocessable Entity with error: "Content exceeds 100KB limit"
- If omitted/null → use default ""

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

### 403 Forbidden

**When:**
- User at plan limit (counted all notes >= plan max)
- No active subscription

**Response:**

```json
{
  "statusCode": 403,
  "message": "Note limit reached (50/50 for Starter plan). Upgrade to Pro for 200 notes.",
  "data": {
    "currentCount": 50,
    "planLimit": 50,
    "planName": "Starter",
    "upgradeUrl": "/pricing"
  }
}
```

Or:

```json
{
  "statusCode": 403,
  "message": "Active subscription required to create notes"
}
```

### 422 Unprocessable Entity

**When:**
- Title exceeds 255 chars
- Content exceeds 100KB

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

### 500 Internal Server Error

**When:**
- Database connection failure
- Unexpected server error

**Response:**

```json
{
  "statusCode": 500,
  "message": "Failed to create note. Please try again."
}
```

---

## Side Effects

**Database Writes:**
- Creates new row in `note` table with userId, title, content, position, timestamps
- Position calculated as MAX(position) + 1 for user's notes

**Events Triggered:**
- None (future: could emit `note.created` event)

**Cache Invalidation:**
- Invalidates user's note list cache: `notes:user:{userId}:list`

**External API Calls:**
- Queries Payments module to check user's plan limit

---

## Edge Cases

**Empty Request Body:**
- Valid, creates note with "Untitled" and empty content

**Rapid Concurrent Creation:**
- Each request creates separate note (non-idempotent)
- Plan limit checked atomically in transaction to prevent race condition

**User at Exact Limit:**
- If user has 50 notes and Starter plan (limit 50), creation blocked
- Deleting note immediately unlocks creation ability

**Unicode Content:**
- Supports full Unicode (emoji, non-Latin scripts)
- 100KB limit applies to UTF-8 byte count, not character count

**Position Collision:**
- If multiple notes created concurrently, positions increment atomically
- No duplicate positions within user's notes

---

## Performance Considerations

**Rate Limiting:**
- Authenticated users: 100 requests per minute per user
- Exceeding limit → 429 Too Many Requests

**Timeout:**
- Request timeout: 5 seconds
- Database write timeout: 3 seconds

**Expected Response Time:**
- p50: <100ms
- p95: <300ms
- p99: <500ms

**Database Query Complexity:**
- Single INSERT after COUNT check
- Position calculated via MAX() aggregate (optimized with index on userId, position)

---

## Integration Points

**Called By:**
- Frontend Notes module: When user clicks "New Note" button

**Depends On:**
- Auth module: Session validation and userId extraction
- Payments module: Plan limit checking (Starter: 50, Pro: 200, Max: unlimited)
- Notes database: `note` table write

**Triggers:**
- None (stateless creation)

---

## Testing Guidance

**Key Test Scenarios:**
1. Successful note creation with defaults (empty body)
2. Successful note creation with custom title and content
3. Plan limit enforcement (Starter: 50, Pro: 200)
4. Position auto-assignment for first note (position = 1)
5. Position auto-assignment for subsequent notes (max + 1)
6. Validation errors (title too long, content too large)
7. Authorization errors (missing token, invalid token)
8. No active subscription
9. Concurrent creation (multiple notes created simultaneously)
10. Unicode content handling

**Edge Cases to Test:**
- Empty string title and content
- Maximum length content (100KB exactly)
- Whitespace-only title (should accept as-is)
- User with 0 notes (position = 1)
- User at exact plan limit
- Rapid creation attempts (rate limiting)
