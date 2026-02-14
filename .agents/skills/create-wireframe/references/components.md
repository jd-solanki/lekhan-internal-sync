# Component Reference

Complete guide to all ASCII wireframe components with exact formatting specifications.

## Form Elements

| Component | ASCII Representation | Formatting Rules |
|:----------|:---------------------|:-----------------|
| **Action Button** | `[    Submit    ]` | **Centered text**, whitespace padding, tight brackets |
| **Input Field (Empty)** | `[____________________]` | Underscores or dots for writable area |
| **Input Field (Filled)** | `[ Jane Doe           ]` | **Left-aligned text**, followed by whitespace/underscores |
| **Textarea** | `[ Line 1 text...       `<br>`  Line 2 text..._______]` | Top-left bracket to start, bottom-right to close. Multi-line |
| **Search Field** | `[?] Search...          ]` | Starts with `[?]` or `(o-` |
| **Select / Dropdown** | `[ Select Item      (v) ]` | Left-aligned text, `(v)` indicator far right |
| **Checkbox (Unchecked)** | `[ ]` | Square brackets with space |
| **Checkbox (Checked)** | `[x]` | Square brackets with `x` |
| **Radio (Unselected)** | `( )` | Parentheses with space |
| **Radio (Selected)** | `(o)` | Parentheses with `o` |
| **Toggle Switch (Off)** | `(O--)` | `O` represents knob position left |
| **Toggle Switch (On)** | `(--O)` | `O` represents knob position right |
| **Slider** | `[----o--------]` | Dash track with `o` representing position |
| **File Upload** | `[ Choose File...   ]` | Left-aligned with ellipsis |
| **Color Picker** | `[#] #FF5733` | `[#]` symbol followed by hex code |

## Navigation Elements

| Component | ASCII Representation | Formatting Rules |
|:----------|:---------------------|:-----------------|
| **Tab (Active)** | `_\| Active \|_` | Underscores and pipes create tab shape |
| **Tab (Inactive)** | `Inactive` | Plain text, no decoration |
| **Nav Group (Collapsed)** | `> Group Name` | Right arrow indicating collapsed state |
| **Nav Group (Expanded)** | `v Group Name` | Down arrow indicating expanded state |
| **Nav Item (Inactive)** | `  - Page Name` | Indented 2 spaces, hyphen prefix |
| **Nav Item (Active)** | `  :: Active Page` | Indented 2 spaces, double colon prefix |
| **Breadcrumb** | `Home > Products > Item` | `>` separators between levels |
| **Hamburger Menu** | `[≡]` or `[|||]` | Three horizontal lines |
| **Menu Item** | `  - Dashboard` | Hyphen prefix, indented in menu |
| **Submenu Item** | `    - Sub Item` | 4-space indent for nested items |

## Layout & Content

| Component | ASCII Representation | Formatting Rules |
|:----------|:---------------------|:-----------------|
| **Card / Container** | `+------------------+`<br>`\| Card Content     \|`<br>`+------------------+` | Box using `+` corners, `-` horizontal, `\|` vertical |
| **Avatar (Icon)** | `(oo)` | Parentheses with two `o` characters |
| **Avatar (Placeholder)** | `[IMG]` | Bracketed code |
| **Image Placeholder** | `[========IMAGE========]` | Equals signs in brackets |
| **Icon** | `[i]` or `[@]` | Single character in brackets |
| **Badge** | `(3)` | Number in parentheses |
| **Tag** | `#tag` | Hashtag prefix |
| **Divider (Horizontal)** | `-------------------` | Dash line |
| **Divider (Vertical)** | `\|` | Pipe character |
| **Header** | `# Heading` or `## Subheading` | Markdown-style |
| **List Item** | `• Item` or `- Item` | Bullet or hyphen prefix |
| **Numbered List** | `1. Item` | Number followed by period |

## Interactive Components

| Component | ASCII Representation | Formatting Rules |
|:----------|:---------------------|:-----------------|
| **Link** | `[Link Text >]` | Right arrow indicates clickable |
| **Close Button** | `[ X ]` | Space, `X`, space in brackets |
| **Minimize Button** | `[ - ]` | Space, hyphen, space in brackets |
| **Maximize Button** | `[ □ ]` | Space, square, space in brackets |
| **Dropdown Trigger** | `(v)` or `[v]` | Down arrow in parentheses or brackets |
| **Tooltip Indicator** | `(?)` or `[?]` | Question mark in container |
| **Sort Indicator (Asc)** | `^` | Up caret |
| **Sort Indicator (Desc)** | `v` | Down caret |
| **Expand/Collapse** | `[+]` / `[-]` | Plus to expand, minus to collapse |

## Data Display

| Component | ASCII Representation | Formatting Rules |
|:----------|:---------------------|:-----------------|
| **Table Header** | `\| Name     \| Age \| City     \|` | Pipe separators, headers |
| **Table Row** | `\| John Doe \| 30  \| New York \|` | Pipe separators, aligned data |
| **Progress Bar (Empty)** | `[----------]` | All dashes |
| **Progress Bar (Partial)** | `[####------]` | Hash for filled, dash for empty |
| **Progress Bar (Full)** | `[##########]` | All hash symbols |
| **Loading Spinner** | `(...)` or `[…]` | Ellipsis in container |
| **Status Indicator (Success)** | `[✓]` or `[OK]` | Check or OK text |
| **Status Indicator (Error)** | `[✗]` or `[ERR]` | X or ERR text |
| **Status Indicator (Warning)** | `[!]` | Exclamation mark |
| **Rating Stars** | `★★★☆☆` or `[***--]` | Filled/empty stars or hash/dash |

## Complex Layout Examples

### Modal Dialog

```text
+---------------------------------------------+
|  Title                              [ X ]   |
|---------------------------------------------|
|                                             |
|  Modal content goes here                    |
|  with multiple lines                        |
|                                             |
|---------------------------------------------|
|        [   Cancel   ]  [     OK     ]       |
+---------------------------------------------+
```

### Form with Validation

```text
+------------------------------------------+
|  Contact Form                            |
|------------------------------------------|
|  Name *                                  |
|  [ John Doe___________]                  |
|                                          |
|  Email *                                 |
|  [ john@_______________] [✗] Invalid     |
|                                          |
|  Message                                 |
|  [ Hello there________                   |
|    _____________________]                |
|                                          |
|  [x] Subscribe to newsletter             |
|                                          |
|          [      Submit      ]            |
+------------------------------------------+
```

### Data Table

```text
+---------------------------------------------------+
| Name          | Status  | Progress | Actions      |
|---------------|---------|----------|--------------|
| Project Alpha | Active  | [####--] | [ Edit >]    |
| Project Beta  | Paused  | [##----] | [ Edit >]    |
| Project Gamma | Done    | [######] | [ View >]    |
+---------------------------------------------------+
```

### Sidebar Navigation

```text
+-----------------------+
| [M] App Name          |
|-----------------------|
| v MAIN                |
|   :: Dashboard        |
|   - Analytics         |
|   - Reports           |
|                       |
| > SETTINGS            |
|   - Profile           |
|   - Security          |
|                       |
| > ADMIN               |
|                       |
|-----------------------|
| (oo) User Name    [v] |
+-----------------------+
```

## Spacing & Alignment Guidelines

### Consistent Padding

Always maintain consistent spacing from content to borders:

```text
Good:                    Bad:
+----------------+       +----------------+
| Content        |       |Content         |
| More content   |       |More content    |
+----------------+       +----------------+
```

### Text Alignment

- **Left-aligned:** Inputs, most text content
- **Centered:** Buttons, modal titles, centered headings
- **Right-aligned:** Actions in tables, numerical data

### Vertical Alignment

All borders must align perfectly:

```text
Good:                           Bad:
+------------------+            +------------------+
| Line 1           |            | Line 1           |
| Longer line 2    |            | Longer line 2   |
+------------------+            +------------------+
                                 (misaligned right border)
```
