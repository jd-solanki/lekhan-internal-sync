---
name: create-wireframe
description: Use when designing text-based UI mockups, visualizing layouts in chat, or specifying component hierarchy without graphical tools
---

# ASCII Wireframes

Generate high-fidelity text-based wireframes using fixed-width grids, ASCII characters, and strict formatting rules to distinguish interactive elements.

## When to Use

Use this skill when:
- Designing UI layouts in chat without graphical tools
- Visualizing component hierarchy and structure
- Creating text-based mockups for rapid prototyping
- Specifying layouts that need to be discussed before implementation

## Core Principles

### Fixed-Width Grid System

All wireframes use a fixed-width container with aligned borders:

- **Corners:** `+`
- **Horizontal borders:** `-`
- **Vertical borders:** `|`
- **Critical rule:** Right-most `|` must align vertically on **every line** using whitespace padding

```text
+------------------+
| Content here     |
| More content     |
+------------------+
```

### Element Distinction Rules

**Buttons vs. Inputs** (critical differential):
- **Buttons:** Centered text with padding: `[    Save    ]`
- **Inputs:** Left-aligned with underscores: `[ Value_______]` or `[___________]`

**Navigation hierarchy:**
- 2-space indentation for nested items
- `>` for collapsed groups, `v` for expanded groups
- `::` for active items, `-` for inactive items

### Quick Component Reference

Common components (see [components.md](references/components.md) for full reference):

**Form elements:**
```text
[    Button    ]        Button (centered)
[ Input text___]        Input field (left-aligned)
[x] Checkbox            Checkbox (checked)
( ) Radio               Radio (unchecked)
[ Select    (v) ]       Dropdown select
```

**Navigation:**
```text
v Group Name            Expanded group
  :: Active Page        Active navigation item
  - Inactive Page       Inactive item
> Collapsed Group       Collapsed group
```

**Layout:**
```text
+----------------+      Card/Container
| Content        |
+----------------+
```

## Example: Settings Page with Sidebar

```text
+-----------------------+-------------------------------------------------------+
| [M] Logo              |  Settings / Profile                           [ X ]   |
|                       |                                                       |
| v GENERAL             |  # Public Profile                                     |
|   :: Profile          |                                                       |
|   - Notifications     |  Display Name                                         |
|                       |  [ Jane Doe___________]                               |
| > BILLING             |                                                       |
|   - Invoices          |  Bio                                                  |
|   - Payment Methods   |  [ Developer & Designer based in NYC.                 |
|                       |    Loves ASCII art.___________________]               |
| > SECURITY            |                                                       |
|                       |  Region                                               |
|                       |  [ United States (US)           (v) ]                 |
|                       |                                                       |
|                       |  ---------------------------------------------------  |
|                       |                                                       |
|                       |  [x] Profile is public                                |
|                       |  [ ] Show email address                               |
|                       |                                                       |
| --------------------- |             [    Save Profile    ]                    |
| [ Jane Doe        (v)]|                                                       |
+-----------------------+-------------------------------------------------------+
```

## Common Mistakes to Avoid

- **Misaligned borders:** All right-side `|` must align vertically (add padding)
- **Centering inputs:** Inputs are left-aligned (only buttons are centered)
- **Inconsistent borders:** Use only `+`, `-`, `|` for the main grid
- **Missing whitespace:** Every line must have proper padding to reach the border

## References

- **[components.md](references/components.md)** - Complete component reference table with all form elements, navigation patterns, and layout components
