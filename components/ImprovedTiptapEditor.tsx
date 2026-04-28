'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

// Extend Image to support inline style (for centering/alignment)
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: 'display:block;margin-left:auto;margin-right:auto;',
        parseHTML: el => (el as HTMLElement).getAttribute('style') || null,
        renderHTML: attrs => attrs.style ? { style: attrs.style } : {},
      },
    };
  },
});
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { TextStyle, Color as ColorExt } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';

// Extend TableCell & TableHeader to support inline background-color
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: el => (el as HTMLElement).style.backgroundColor || null,
        renderHTML: attrs => {
          if (!attrs.backgroundColor) return {};
          return { style: `background-color: ${attrs.backgroundColor}` };
        },
      },
    };
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: el => (el as HTMLElement).style.backgroundColor || null,
        renderHTML: attrs => {
          if (!attrs.backgroundColor) return {};
          return { style: `background-color: ${attrs.backgroundColor}` };
        },
      },
    };
  },
});
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  ImagePlus,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  Highlighter,
  Palette,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';

interface ImprovedTiptapEditorProps {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  uploadUrl?: string;
  uploadFieldName?: string;
}

const TEXT_COLORS = [
  { label: 'Default', value: '' },
  { label: 'Navy', value: '#021d49' },
  { label: 'Blue', value: '#1d4ed8' },
  { label: 'Green', value: '#166534' },
  { label: 'Red', value: '#dc2626' },
  { label: 'Orange', value: '#ea580c' },
  { label: 'Gray', value: '#6b7280' },
  { label: 'White', value: '#ffffff' },
];

const HIGHLIGHT_COLORS = [
  { label: 'None', value: '' },
  { label: 'Light Blue', value: '#dbeafe' },
  { label: 'Light Green', value: '#dcfce7' },
  { label: 'Light Yellow', value: '#fef9c3' },
  { label: 'Light Pink', value: '#fce7f3' },
  { label: 'Light Gray', value: '#f3f4f6' },
  { label: 'Navy Tint', value: '#e0e7ef' },
];

export default function ImprovedTiptapEditor({
  value = '',
  onChange,
  placeholder = 'Start typing your content here...',
  uploadUrl = 'https://api.demo.arin-africa.org/journal-articles/upload-description-image',
  uploadFieldName = 'image',
}: ImprovedTiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [imageColor, setImageColor] = useState('#ffffff');
  const [showImageColorPicker, setShowImageColorPicker] = useState(false);
  const [showCellColorPicker, setShowCellColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 shadow-md',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      TextStyle,
      ColorExt,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: false }),
      TableRow,
      CustomTableHeader,
      CustomTableCell,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && value) {
      const currentContent = editor.getHTML();
      if (value !== currentContent) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editor) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const descForm = new FormData();
      descForm.append(uploadFieldName, file);

      try {
        let res = await fetch(uploadUrl, {
          method: 'POST',
          body: descForm,
          credentials: 'include',
        });

        if (res.status === 404) {
          const mainForm = new FormData();
          mainForm.append('file', file);
          res = await fetch('https://api.demo.arin-africa.org/research-projects/upload', {
            method: 'POST',
            body: mainForm,
            credentials: 'include',
          });
        }

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        if (data.url) {
          const fullUrl = data.url.startsWith('http')
            ? data.url
            : `https://api.demo.arin-africa.org${data.url}`;

          // Insert image wrapped in a colored div
          const wrappedHtml = `<div style="background-color:${imageColor};padding:8px;border-radius:8px;display:inline-block;"><img src="${fullUrl}" class="rounded-lg max-w-full h-auto shadow-md" /></div>`;
          editor.chain().focus().insertContent(wrappedHtml).run();
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert(`Failed to upload image: ${file.name}`);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowImageColorPicker(false);
  };

  const insertTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) return null;

  const isInTable =
    editor.isActive('tableCell') ||
    editor.isActive('tableHeader') ||
    editor.isActive('table');

  const isImageSelected = editor.isActive('image');

  const setImageAlign = (align: 'left' | 'center' | 'right') => {
    const styleMap: Record<string, string> = {
      left:   'display:block;margin-left:0;margin-right:auto;max-width:100%;',
      center: 'display:block;margin-left:auto;margin-right:auto;max-width:100%;',
      right:  'display:block;margin-left:auto;margin-right:0;max-width:100%;',
    };
    editor.chain().focus().updateAttributes('image', { style: styleMap[align] }).run();
  };

  return (
    <div className="border-2 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b-2">

        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" size="sm" variant={editor.isActive('bold') ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant={editor.isActive('italic') ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant={editor.isActive('underline') ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" size="sm" variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" size="sm" variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" size="sm" variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align Center">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right">
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Color */}
        <div className="relative border-r pr-2">
          <Button type="button" size="sm" variant="ghost"
            onClick={() => { setShowColorPicker(v => !v); setShowHighlightPicker(false); setShowImageColorPicker(false); }}
            title="Text Color"
            className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            <span className="text-[10px]">A</span>
          </Button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-wrap gap-1.5 w-44">
              <p className="w-full text-[10px] text-gray-500 font-semibold mb-1">Text Color</p>
              {TEXT_COLORS.map(c => (
                <button key={c.value} type="button" title={c.label}
                  onClick={() => {
                    if (!c.value) editor.chain().focus().unsetColor().run();
                    else editor.chain().focus().setColor(c.value).run();
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value || '#f9f9f9' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight / Background Color */}
        <div className="relative border-r pr-2">
          <Button type="button" size="sm" variant={editor.isActive('highlight') ? 'default' : 'ghost'}
            onClick={() => { setShowHighlightPicker(v => !v); setShowColorPicker(false); setShowImageColorPicker(false); }}
            title="Highlight / Background Color"
            className="flex items-center gap-1">
            <Highlighter className="h-4 w-4" />
          </Button>
          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-wrap gap-1.5 w-52">
              <p className="w-full text-[10px] text-gray-500 font-semibold mb-1">Highlight Color</p>
              {HIGHLIGHT_COLORS.map(c => (
                <button key={c.value} type="button" title={c.label}
                  onClick={() => {
                    if (!c.value) editor.chain().focus().unsetHighlight().run();
                    else editor.chain().focus().setHighlight({ color: c.value }).run();
                    setShowHighlightPicker(false);
                  }}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value || '#f9f9f9' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Image Upload with Color */}
        <div className="relative border-r pr-2">
          <Button type="button" size="sm" variant="ghost"
            onClick={() => { setShowImageColorPicker(v => !v); setShowColorPicker(false); setShowHighlightPicker(false); }}
            title="Insert Image with Background Color"
            className="bg-blue-50 hover:bg-blue-100 flex items-center gap-1">
            <ImagePlus className="h-4 w-4" />
          </Button>
          {showImageColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-56">
              <p className="text-[11px] text-gray-500 font-semibold mb-2">Image Background Color</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[
                  { label: 'None', value: '#ffffff' },
                  { label: 'Light Blue', value: '#dbeafe' },
                  { label: 'Light Green', value: '#dcfce7' },
                  { label: 'Light Yellow', value: '#fef9c3' },
                  { label: 'Navy Tint', value: '#e0e7ef' },
                  { label: 'Light Pink', value: '#fce7f3' },
                  { label: 'Light Gray', value: '#f3f4f6' },
                  { label: 'Navy', value: '#021d49' },
                ].map(c => (
                  <button key={c.value} type="button" title={c.label}
                    onClick={() => setImageColor(c.value)}
                    className={`w-7 h-7 rounded border-2 hover:scale-110 transition-transform ${imageColor === c.value ? 'border-blue-500' : 'border-gray-300'}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-[10px] text-gray-500">Custom:</label>
                <input type="color" value={imageColor} onChange={e => setImageColor(e.target.value)}
                  className="w-8 h-7 rounded border border-gray-300 cursor-pointer" />
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 bg-[#021d49] text-white text-xs font-semibold rounded-lg hover:bg-[#032a5e] transition-colors">
                Choose Image
              </button>
            </div>
          )}
        </div>

        {/* Link */}
        <div className="flex gap-1 border-r pr-2">
          <Button type="button" size="sm" variant={editor.isActive('link') ? 'default' : 'ghost'}
            onClick={addLink} title="Add Link">
            <Link2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Table — Insert button */}
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="ghost"
            onClick={insertTable}
            title="Insert Table"
            className="flex items-center gap-1 text-[11px] font-semibold">
            <TableIcon className="h-4 w-4" />
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <Button type="button" size="sm" variant="ghost"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()} title="Undo">
            <Undo className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="ghost"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()} title="Redo">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Image alignment bar — visible when an image is selected */}
      {isImageSelected && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border-b border-purple-200">
          <ImagePlus className="h-3.5 w-3.5 text-purple-600 shrink-0" />
          <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wide mr-2">Image Align</span>
          <button type="button" onClick={() => setImageAlign('left')}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-purple-200 hover:bg-purple-100 text-purple-700 font-medium transition-colors"
            title="Align Left">
            <AlignLeft className="h-3 w-3" /> Left
          </button>
          <button type="button" onClick={() => setImageAlign('center')}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-purple-200 hover:bg-purple-100 text-purple-700 font-medium transition-colors"
            title="Align Center">
            <AlignCenter className="h-3 w-3" /> Center
          </button>
          <button type="button" onClick={() => setImageAlign('right')}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-purple-200 hover:bg-purple-100 text-purple-700 font-medium transition-colors"
            title="Align Right">
            <AlignRight className="h-3 w-3" /> Right
          </button>
        </div>
      )}

      {/* Table toolbar — visible only when cursor is inside a table */}
      {isInTable && (
        <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border-b border-blue-200">
          <TableIcon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
          <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wide mr-2">Table</span>

          {/* Row actions */}
          <button type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 font-medium transition-colors"
            title="Add Row Above">
            <Plus className="h-3 w-3" />Row Above
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 font-medium transition-colors"
            title="Add Row Below">
            <Plus className="h-3 w-3" />Row Below
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-orange-200 hover:bg-orange-50 text-orange-600 font-medium transition-colors"
            title="Delete Row">
            <Minus className="h-3 w-3" />Del Row
          </button>

          <div className="w-px h-4 bg-blue-200 mx-1" />

          {/* Column actions */}
          <button type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 font-medium transition-colors"
            title="Add Column Left">
            <Plus className="h-3 w-3" />Col Left
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-blue-200 hover:bg-blue-100 text-blue-700 font-medium transition-colors"
            title="Add Column Right">
            <Plus className="h-3 w-3" />Col Right
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-orange-200 hover:bg-orange-50 text-orange-600 font-medium transition-colors"
            title="Delete Column">
            <Minus className="h-3 w-3" />Del Col
          </button>

          <div className="w-px h-4 bg-blue-200 mx-1" />

          {/* Cell background color picker */}
          <div className="relative">
            <button type="button"
              onClick={() => setShowCellColorPicker(v => !v)}
              className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded bg-white border border-purple-200 hover:bg-purple-50 text-purple-700 font-medium transition-colors"
              title="Cell Background Color">
              <Palette className="h-3 w-3" />Cell Color
            </button>
            {showCellColorPicker && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-64">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-2">Cell Background</p>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {[
                    { label: 'Clear', value: '' },
                    { label: 'Light Blue', value: '#dbeafe' },
                    { label: 'Sky Blue', value: '#bae6fd' },
                    { label: 'Light Green', value: '#dcfce7' },
                    { label: 'Mint', value: '#a7f3d0' },
                    { label: 'Light Yellow', value: '#fef9c3' },
                    { label: 'Amber', value: '#fde68a' },
                    { label: 'Light Pink', value: '#fce7f3' },
                    { label: 'Light Gray', value: '#f3f4f6' },
                    { label: 'Navy Tint', value: '#e0e7ef' },
                    { label: 'Navy', value: '#021d49' },
                    { label: 'Blue', value: '#1d4ed8' },
                    { label: 'Green', value: '#166534' },
                    { label: 'Red', value: '#fef2f2' },
                    { label: 'White', value: '#ffffff' },
                  ].map(c => (
                    <button key={c.value} type="button" title={c.label}
                      onClick={() => {
                        editor.chain().focus().setCellAttribute('backgroundColor', c.value || null).run();
                        setShowCellColorPicker(false);
                      }}
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 hover:border-gray-500 transition-transform flex items-center justify-center"
                      style={{ backgroundColor: c.value || '#f9f9f9' }}>
                      {!c.value && <span className="text-[9px] text-gray-400 font-bold">✕</span>}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 border-t pt-2">
                  <label className="text-[10px] text-gray-500 shrink-0">Custom:</label>
                  <input type="color" defaultValue="#dbeafe"
                    onChange={e => {
                      editor.chain().focus().setCellAttribute('backgroundColor', e.target.value).run();
                    }}
                    className="w-8 h-7 rounded border border-gray-300 cursor-pointer" />
                  <span className="text-[10px] text-gray-400">Pick any color</span>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-blue-200 mx-1" />

          {/* Delete Table */}
          <button type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white border border-red-200 hover:bg-red-50 text-red-600 font-medium transition-colors"
            title="Delete Entire Table">
            <Trash2 className="h-3 w-3" />Delete Table
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-white" onClick={() => { setShowColorPicker(false); setShowHighlightPicker(false); setShowImageColorPicker(false); }}>
        <style>{`
          .ProseMirror table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
          }
          .ProseMirror table td,
          .ProseMirror table th {
            border: 1px solid #d1d5db;
            padding: 8px 12px;
            min-width: 80px;
            vertical-align: top;
          }
          .ProseMirror table th {
            background-color: #021d49;
            color: white;
            font-weight: 600;
            text-align: left;
          }
          .ProseMirror table tr:nth-child(even) td {
            background-color: #f8fafc;
          }
          .ProseMirror table tr:hover td {
            background-color: #eff6ff;
          }
          .ProseMirror .selectedCell:after {
            background: rgba(2, 29, 73, 0.12);
            content: "";
            left: 0; right: 0; top: 0; bottom: 0;
            pointer-events: none;
            position: absolute;
            z-index: 2;
          }
          .ProseMirror .column-resize-handle {
            background-color: #021d49;
            bottom: -2px;
            position: absolute;
            right: -2px;
            top: 0;
            width: 4px;
            pointer-events: none;
          }
        `}</style>
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {/* Helper text */}
      <div className="px-4 py-2 bg-slate-50 border-t text-xs text-slate-500 flex flex-wrap gap-4">
        <span><span className="font-medium">Image:</span> Click the image button, pick a background color, then upload</span>
        <span><span className="font-medium">Table:</span> Click the table icon to insert or edit rows/columns</span>
        <span><span className="font-medium">Color:</span> Select text first, then apply text or highlight color</span>
      </div>
    </div>
  );
}
