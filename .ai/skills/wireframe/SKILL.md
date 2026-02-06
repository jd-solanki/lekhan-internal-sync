---
name: wireframe
description: Use when designing text-based UI mockups, visualizing layouts in chat, or specifying component hierarchy without graphical tools
---

# Creating ASCII Wireframes

## Overview

A strict methodology for generating high-fidelity text-based wireframing. This system relies on indented spacing for hierarchy, a fixed-width grid for layout, and specific ASCII character patterns to distinguish interactive elements (like distinguishing a Button from a Text Input). Wireframe should be ALWAYS created in 16:9 aspect ratio, with a maximum width of 80 characters to ensure readability across different platforms.

## Layout & Grid System

The foundation of the wireframe is a fixed-width container. All elements must reside within this grid.

* **Container Structure:** Use `+` for corners, `-` for horizontal borders, and `|` for vertical borders.
* **Vertical Alignment:** The right-most border `|` must be vertically aligned on **every single line**. You must use whitespace padding to achieve this.
* **Columns:** Use the pipe character `|` to create vertical separations (e.g., Sidebar vs. Main Content).

## Strict Distinction Rules

You must distinguish interactive elements using these specific patterns:

**1. Buttons vs. Inputs (The Critical Differential)**

* **Buttons:** Text is **CENTERED** with whitespace padding and tight brackets.
  * *Correct:* `[    Save    ]`
* **Inputs:** Text is **LEFT ALIGNED**. Empty space is denoted by underscores `_` or dots `.`.
  * *Correct:* `[ Value_______]` or `[___________]`

**2. Hierarchy**

* Use indentation (2 spaces) to show depth in navigation or tree views.

## Component Reference

| Category | Component Name | ASCII Representation | Style of ASCII Representation |
| :--- | :--- | :--- | :--- |
| **Form Elements** | **Action Button** | `[    Submit    ]` | **Centered text**, whitespace padding, tight brackets. |
| **Form Elements** | **Input Field (Empty)** | `[____________________]` | Underscores or dots representing the writable area. |
| **Form Elements** | **Input Field (Filled)** | `[ Jane Doe           ]` | **Left-aligned text**, followed by whitespace/underscores. |
| **Form Elements** | **Textarea** | `[ Line 1 text...`<br>`Line 2 text..._______]` | Top-left bracket to start, bottom-right bracket to close. Multi-line height. |
| **Form Elements** | **Search Field** | `[?] Search...          ]` | Starts with `[?]` or `(o-`. |
| **Form Elements** | **Select / Dropdown** | `[ Select Item      (v) ]` | Left-aligned text, `(v)` indicator on the far right. |
| **Form Elements** | **Checkbox** | `[ ]` or `[x]` | Square brackets. Space for unchecked, `x` for checked. |
| **Form Elements** | **Radio** | `( )` or `(o)` | Parentheses. Space for unselected, `o` for selected. |
| **Form Elements** | **Toggle Switch** | `(O--)` / `(--O)` | `O` represents the knob position (Off/On). |
| **Navigation** | **Tabs** | `_\| Active \|_  Inactive` | Underscores and pipes create the tab shape. |
| **Navigation** | **Nav Group (Closed)** | `> Group Name` | Right arrow indicating collapsed state. |
| **Navigation** | **Nav Group (Open)** | `v Group Name` | Down arrow indicating expanded state. |
| **Navigation** | **Nav Item** | `- Page Name` | Indented 2 spaces, prefixed with hyphen. |
| **Navigation** | **Active Nav Item** | `:: Active Page` | Double colon indicates current selection. |
| **Layout & Content** | **Card / Container** | `+------------------+`<br>`\| Card Content     \|`<br>`+------------------+` | Box using `+` corners, `-` horizontal borders, `\|` vertical borders. |
| **Layout & Content** | **Avatar** | `(oo)` or `[IMG]` | Small circle or bracketed code. |
| **Visuals & Status** | **Badge** | `( Badge )` | Parentheses indicate rounded "pill" shape. |
| **Layout & Content** | **Callout / Alert** | `+------------------+`<br>`\| (!) Alert Text   \|`<br>`+------------------+` | Box with leading icon indicator like `(!)` or `(i)`. |
| **Layout & Content** | **Card (Title + Content)** | `+------------------+`<br>`\| **Card Title**   \|`<br>`+------------------+`<br>`\| Body Content...  \|`<br>`+------------------+` | Header separated by full-width horizontal divider. |
| **Form Elements** | **Avatar Dropdown** | `[ (oo) User Name  (v) ]` | Select input containing an avatar representation `(oo)`. |


## Shorthands for Icons

Use single bracketed letters or symbols to represent common icons without using large ASCII art.

* `[M]` : Menu / Hamburger Icon
* `[?]` : Help / Info / Question Mark
* `[x]` : Close / Delete
* `[+]` : Add / Create
* `[<] / [>]` : Back / Forward navigation
* `[!]` : Alert / Warning

## Example Output

**User Request:** "Account settings with a sidebar."

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

## Common Mistakes

* **Misaligned Borders:** Failing to pad lines with spaces, causing the right-most `|` to be jagged.
* **Centering Inputs:** Making inputs look like buttons. Inputs must be left-aligned.
* **Lazy Borders:** Using characters other than `+`, `-`, and `|` for the main grid.
