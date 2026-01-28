"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

export default function WysiwygEditor({ value, onChange }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const isMountedRef = useRef(false);
  const isInitialized = useRef(false);
  const lastValue = useRef(value);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Only initialize once when component mounts or when value changes externally
  useEffect(() => {
    if (!isMountedRef.current) return;

    // Skip if already initialized and value hasn't changed externally
    if (isInitialized.current && value === lastValue.current) return;

    if (value && typeof value === 'string' && value.trim()) {
      try {
        // Strip out any existing entity references that might cause issues
        const cleanHtml = value.replace(/data-entity-\w+="[^"]*"/g, '');
        const contentBlock = htmlToDraft(cleanHtml);
        if (contentBlock && contentBlock.contentBlocks) {
          // Create content state WITHOUT any entity map to avoid null entity errors
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
            {} // Empty entity map
          );
          const newEditorState = EditorState.createWithContent(contentState);
          if (isMountedRef.current) setEditorState(newEditorState);
          isInitialized.current = true;
          lastValue.current = value;
        } else {
          if (isMountedRef.current) setEditorState(EditorState.createEmpty());
          isInitialized.current = true;
        }
      } catch (err) {
        console.error('Error converting HTML to Draft.js:', err);
        if (isMountedRef.current) setEditorState(EditorState.createEmpty());
        isInitialized.current = true;
      }
    } else if (!value || value.trim() === '') {
      if (isMountedRef.current) setEditorState(EditorState.createEmpty());
      isInitialized.current = true;
    }
  }, [value]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    lastValue.current = null; // Mark that content is being edited

    try {
      const rawContentState = convertToRaw(newEditorState.getCurrentContent());
      // Clean the raw content to remove any null entities
      const cleanRawContent = {
        ...rawContentState,
        entityMap: Object.keys(rawContentState.entityMap).reduce((acc, key) => {
          const entity = rawContentState.entityMap[key];
          if (entity && entity.type && entity.data !== null) {
            acc[key] = entity;
          }
          return acc;
        }, {})
      };

      const html = draftToHtml(cleanRawContent);
      onChange(html);
    } catch (err) {
      console.error('Error converting Draft.js to HTML:', err);
    }
  };

  if (!isMountedRef.current) {
    return (
      <div className="border rounded-md p-2 bg-white min-h-[200px]">
        <div className="animate-pulse bg-gray-100 h-full rounded"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-2 bg-white">
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline'],
          },
        }}
      />
    </div>
  );
}