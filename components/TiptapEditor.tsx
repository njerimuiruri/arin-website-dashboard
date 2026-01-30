import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

import { Button } from '@/components/ui/button';

export default function TiptapEditor({ value, onChange }) {
  const [selectedImagePos, setSelectedImagePos] = useState(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.extend({
        addNodeView() {
          // Use default node view
        },
        addProseMirrorPlugins() {
          return [
            {
              props: {
                handleClickOn: (view, pos, node, nodePos, event) => {
                  if (node.type.name === 'image') {
                    setSelectedImagePos(nodePos);
                  } else {
                    setSelectedImagePos(null);
                  }
                  return false;
                },
              },
            },
          ];
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  // Deselect image if selection changes
  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const { from, to } = editor.state.selection;
      if (from !== to) setSelectedImagePos(null);
    };
    editor.on('selectionUpdate', update);
    return () => editor.off('selectionUpdate', update);
  }, [editor]);

  const handleReplaceImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || selectedImagePos === null || !editor) return;
    // Upload image
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('https://api.demo.arin-africa.org/research-projects/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.url) throw new Error('Image upload failed');
      // Replace image node at selectedImagePos
      editor.chain().focus().command(({ tr }) => {
        const node = tr.doc.nodeAt(selectedImagePos);
        if (node && node.type.name === 'image') {
          tr.setNodeMarkup(selectedImagePos, undefined, {
            ...node.attrs,
            src: data.url,
          });
          return true;
        }
        return false;
      }).run();
      setSelectedImagePos(null);
    } catch (err) {
      alert(err.message || 'Image upload failed');
    }
  };

  if (!editor) {
    return null;
  }

  // Only render the rest if editor is ready
  return (
    <div className="border rounded-md p-2 bg-white relative">
      <EditorContent editor={editor} />
      {selectedImagePos !== null && (
        <div className="absolute z-10 top-2 right-2 flex gap-2">
          <Button size="sm" variant="outline" onClick={handleReplaceImage}>
            Replace Image
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
