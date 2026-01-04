import React, { useMemo, useCallback, useState } from 'react';
import { createEditor, Transforms, Editor, Element as SlateElement, Descendant } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const ToolbarButton = ({ format, icon, onClick }) => {
  const editor = useSlate();
  return (
    <button
      type="button"
      onMouseDown={event => {
        event.preventDefault();
        onClick(editor, format);
      }}
      style={{ marginRight: 8 }}
    >
      {icon}
    </button>
  );
};

const insertImage = (editor, url) => {
  const text = { text: '' };
  const image = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const Element = props => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'image':
      return <img {...attributes} src={element.url} alt="" style={{ maxWidth: '100%', margin: '8px 0' }} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

function toggleMark(editor, format) {
  const isActive = Editor.marks(editor)?.[format] === true;
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);
  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
    split: true,
  });
  const newType = isActive ? 'paragraph' : isList ? 'list-item' : format;
  Transforms.setNodes(editor, { type: newType });
  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

function isBlockActive(editor, format) {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });
  return !!match;
}

export default function SlateEditor({ value, onChange }) {
  const editor = useMemo(() => withReact(createEditor()), []);

  // Ensure value is always a valid Slate value
  const validValue = useMemo(() => {
    // Always return a valid Slate value
    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    // fallback: always return a valid array
    return initialValue;
  }, [value]);

  const handleChange = useCallback(
    (val) => {
      onChange(val);
    },
    [onChange]
  );

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Create FormData and upload to your server
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:5001/research-projects/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        // Use the full URL from server
        const fullUrl = data.url.startsWith('http') ? data.url : `http://localhost:5001${data.url}`;
        insertImage(editor, fullUrl);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      // Fallback to local URL for preview
      const url = URL.createObjectURL(file);
      insertImage(editor, url);
    }
  };

  // Final fallback: never pass undefined to Slate
  const safeValue = Array.isArray(validValue) && validValue.length > 0 ? validValue : initialValue;
  return (
    <Slate
      editor={editor}
      initialValue={safeValue}
      onChange={handleChange}
    >
      <div style={{ marginBottom: 8 }}>
        <ToolbarButton format="bold" icon={<b>B</b>} onClick={toggleMark} />
        <ToolbarButton format="italic" icon={<i>I</i>} onClick={toggleMark} />
        <ToolbarButton format="underline" icon={<u>U</u>} onClick={toggleMark} />
        <ToolbarButton format="numbered-list" icon={<span>OL</span>} onClick={toggleBlock} />
        <ToolbarButton format="bulleted-list" icon={<span>UL</span>} onClick={toggleBlock} />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'inline-block', width: 100 }}
          onChange={handleImageUpload}
        />
      </div>
      <Editable
        className="min-h-[120px] border-2 focus:border-indigo-500 transition-all p-2 rounded-md bg-white"
        placeholder="Enter project description..."
        renderElement={props => <Element {...props} />}
        renderLeaf={props => <Leaf {...props} />}
      />
    </Slate>
  );
}