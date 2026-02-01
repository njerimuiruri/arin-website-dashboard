import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import React from 'react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image'],
  ['clean']
];

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  return (
    <div className="quill-editor-wrapper">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={{ toolbar: toolbarOptions }}
        theme="snow"
        style={{ minHeight: 180 }}
      />
    </div>
  );
}