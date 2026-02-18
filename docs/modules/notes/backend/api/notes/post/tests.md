# POST /api/notes — Test Scenarios

## Happy Path

- [ ] Create note with empty body → 201 with id, userId, title="Untitled", content="", position=1, timestamps
- [ ] Create note with custom title → 201 with provided title
- [ ] Create note with custom content → 201 with provided content
- [ ] Create note with both title and content → 201 with both values
- [ ] First note for user → position = 1
- [ ] Second note for user → position = 2 (max + 1)
- [ ] Location header contains /api/notes/{id}

## Authentication

- [ ] Missing Authorization header → 401 Unauthorized
- [ ] Invalid token format → 401 Unauthorized
- [ ] Expired token → 401 Unauthorized
- [ ] Valid token → 201 Created

## Authorization

- [ ] User at Starter plan limit (50 notes) → 403 Forbidden with upgrade message
- [ ] User at Pro plan limit (200 notes) → 403 Forbidden with upgrade message
- [ ] User on Max plan with 500 notes → 201 Created (unlimited)
- [ ] User with no active subscription → 403 Forbidden
- [ ] User 1 note below limit → 201 Created
- [ ] User deletes note then creates → 201 Created (unlocked)

## Validation

- [ ] Title 255 chars → 201 Created
- [ ] Title 256 chars → 422 Unprocessable Entity
- [ ] Empty string title → 201 with empty title
- [ ] Null title → 201 with "Untitled"
- [ ] Omitted title → 201 with "Untitled"
- [ ] Content 100KB (102400 bytes) → 201 Created
- [ ] Content 100KB + 1 byte → 422 Unprocessable Entity
- [ ] Empty string content → 201 with empty content
- [ ] Null content → 201 with empty content
- [ ] Malformed JSON body → 400 Bad Request

## Edge Cases

- [ ] Unicode emoji in title → 201 Created with emoji preserved
- [ ] Unicode non-Latin scripts in content → 201 Created
- [ ] Whitespace-only title → 201 with whitespace title (not trimmed)
- [ ] Large content (95KB) → 201 Created
- [ ] Content with newlines and special chars → 201 Created, markdown preserved

## Concurrent Operations

- [ ] 2 simultaneous create requests → both get 201 with unique IDs and positions
- [ ] 10 rapid creates → all succeed with sequential positions
- [ ] Create while another user creates → both succeed independently
- [ ] Create at exact plan limit during concurrent delete → race handled correctly

## Performance

- [ ] Response time < 300ms at p95
- [ ] 100 creates in 60 seconds → all succeed
- [ ] 101st create in 60 seconds → 429 Too Many Requests (rate limit)

## Plan Limit Scenarios

- [ ] Starter user with 0 notes creates → 201 (1/50)
- [ ] Starter user with 49 notes creates → 201 (50/50)
- [ ] Starter user with 50 notes creates → 403 Forbidden
- [ ] Pro user with 199 notes creates → 201 (200/200)
- [ ] Pro user with 200 notes creates → 403 Forbidden
- [ ] Max user with 1000 notes creates → 201 Created
- [ ] User upgrades from Starter to Pro → can create notes 51-200
