# Search for Notes

## Story
**As a** authenticated user  
**I want** to find notes instantly by typing in search bar  
**So that** I can locate specific content without scrolling through entire list

**Module:** Notes

## Acceptance Criteria
- [ ] Search bar visible at top of notes sidebar
- [ ] Results appear as user types (no submit button required)
- [ ] Search completes within 100ms perceived latency
- [ ] Matches found in note title and content
- [ ] Results highlight matched text
- [ ] Empty search shows all notes (reset to full list)
- [ ] "No results" message when no matches found

## How it Works
1. User focuses search bar, types query
2. Debounced search triggers after 200ms pause in typing
3. Client-side filter searches across note titles and markdown content
4. Matching notes displayed in sidebar, non-matches hidden
5. Matched text highlighted in yellow/bold
6. Results update in real-time as user continues typing
7. Clearing search restores full note list

## Alternate Flows
- **Very large note collection (500+ notes)**: Use server-side search with indexed database queries to maintain <100ms response time
- **Special characters in query**: Escape regex special chars to prevent search errors
- **Case-insensitive matching**: "Meeting" matches "meeting", "MEETING", "MeEtInG" 

## Edge Cases
- Search with only whitespace: Treat as empty search, show all notes
- User has no notes: Search bar still visible but disabled/grayed out
- Query matches 100+ notes: Virtualize sidebar list for performance (render only visible items)
- Rapid typing: Debounce prevents excessive search operations
- Search during note creation: New unsaved notes excluded from results until first auto-save

## Notes
- Client-side search acceptable for <200 notes (fast, no latency)
- Server-side search required for larger collections (use database full-text index)
- Search scope: title + content only (no metadata like created date)
- Highlight implementation: wrap matched substrings in `<mark>` tags
- Preserve search query when navigating between notes (don't clear on note open)
- Search is AND-based for multi-word queries: "meeting notes" finds notes containing both words
