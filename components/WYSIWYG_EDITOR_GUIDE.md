# WYSIWYG Editor Guide

## Overview

The project now uses **TipTap Editor** - a modern, stable, and user-friendly rich text editor with full image upload support.

## Features

### ✨ Rich Text Formatting

- **Bold**, _Italic_, <u>Underline</u>
- Headings (H1, H2, H3)
- Bullet Lists & Numbered Lists
- Text Alignment (Left, Center, Right)
- Links
- **Multiple Image Uploads**

### 📸 Image Support

- Upload multiple images at once
- Drag and drop support
- Images are automatically uploaded to backend
- Images display with proper styling
- Full editing support - add/remove/replace images

## Components

### 1. ImprovedTiptapEditor

**Location**: `components/ImprovedTiptapEditor.tsx`

**Usage**:

```tsx
import ImprovedTiptapEditor from "@/components/ImprovedTiptapEditor";

<ImprovedTiptapEditor
  value={htmlContent}
  onChange={(html) => setContent(html)}
  placeholder="Start typing..."
/>;
```

**Props**:

- `value`: string (HTML content)
- `onChange`: (html: string) => void
- `placeholder`: string (optional)

### 2. HtmlRenderer

**Location**: `components/HtmlRenderer.tsx`

**Usage**:

```tsx
import HtmlRenderer from "@/components/HtmlRenderer";

<HtmlRenderer content={htmlContent} />;
```

**Props**:

- `content`: string (HTML to render)
- `className`: string (optional, additional CSS classes)

## Implementation

### Create Page

- Location: `app/dashboard/programs/research-projects/new/page.tsx`
- Editor saves content as HTML string
- Images are uploaded during editing

### Edit Page

- Location: `app/dashboard/programs/research-projects/[id]/edit/page.tsx`
- Loads existing HTML content
- Supports legacy Slate JSON format (converts to HTML)
- Images can be added/modified

### View Page

- Location: `app/dashboard/programs/research-projects/[id]/page.tsx`
- Uses HtmlRenderer to display formatted content
- Supports both HTML and legacy Slate JSON formats

## Image Upload

### Backend Endpoint

```
POST https://api.demo.arin-africa.org/research-projects/upload
```

### How It Works

1. User clicks "Insert Image" button in toolbar
2. File picker allows multiple image selection
3. Each image is uploaded to backend
4. Backend returns image URL
5. Image is inserted into editor at cursor position

### Service Function

```typescript
import { uploadImage } from "@/services/researchProjectService";

const result = await uploadImage(file);
// Returns: { url: string }
```

## Toolbar Buttons

| Icon     | Function      | Shortcut |
| -------- | ------------- | -------- |
| **B**    | Bold          | Ctrl+B   |
| _I_      | Italic        | Ctrl+I   |
| <u>U</u> | Underline     | Ctrl+U   |
| H1       | Heading 1     | -        |
| H2       | Heading 2     | -        |
| H3       | Heading 3     | -        |
| •        | Bullet List   | -        |
| 1.       | Numbered List | -        |
| ←        | Align Left    | -        |
| ↔        | Align Center  | -        |
| →        | Align Right   | -        |
| 🖼️       | Insert Images | -        |
| 🔗       | Add Link      | -        |
| ↶        | Undo          | Ctrl+Z   |
| ↷        | Redo          | Ctrl+Y   |

## Data Format

### Storage

Content is stored as HTML strings in the database:

```html
<h1>Project Title</h1>
<p>Description with <strong>bold</strong> text</p>
<img src="https://api.demo.arin-africa.org/uploads/image.jpg" />
```

### Legacy Format Support

The system also supports old Slate JSON format and converts it automatically:

```json
[
  {
    "type": "paragraph",
    "children": [{ "text": "Content" }]
  }
]
```

## Styling

### Editor Styles

- Uses Tailwind Typography (`@tailwindcss/typography`)
- Prose classes for beautiful text rendering
- Custom image styling with rounded corners and shadows

### Custom CSS

Located in `app/globals.css`:

```css
@import "@tailwindcss/typography";
```

## Tips for Users

1. **Multiple Images**: Click the image button and select multiple files at once
2. **Image Quality**: Upload high-resolution images - they're automatically optimized
3. **Formatting**: Use the toolbar for quick formatting
4. **Keyboard Shortcuts**: Use Ctrl+B, Ctrl+I, Ctrl+U for quick formatting
5. **Links**: Highlight text first, then click the link button

## Troubleshooting

### Images not uploading?

- Check backend is running on `https://api.demo.arin-africa.org`
- Verify upload endpoint: `/research-projects/upload`
- Check browser console for errors

### Content not saving?

- Ensure form validation passes
- Check network tab for API errors
- Verify backend CORS settings

### Formatting not displaying?

- Ensure `@tailwindcss/typography` is installed
- Check prose classes are applied in HtmlRenderer
- Verify globals.css imports typography plugin

## Migration from Slate

If you have existing projects using Slate format:

1. Old data is automatically converted when loading
2. New edits save as HTML
3. No manual migration needed
4. Legacy data remains readable

## Dependencies

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-underline": "^2.x",
  "@tiptap/extension-text-align": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tailwindcss/typography": "^0.x"
}
```

## Future Enhancements

Potential additions:

- [ ] Video embeds
- [ ] Table support
- [ ] Code blocks with syntax highlighting
- [ ] Emoji picker
- [ ] Drag-and-drop image reordering
- [ ] Image captions
- [ ] Markdown import/export
