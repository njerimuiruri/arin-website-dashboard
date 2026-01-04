import React from 'react';
import { Descendant } from 'slate';

const Element = ({ element, children }) => {
  switch (element.type) {
    case 'bulleted-list':
      return <ul>{children}</ul>;
    case 'numbered-list':
      return <ol>{children}</ol>;
    case 'list-item':
      return <li>{children}</li>;
    case 'image':
      return <img src={element.url} alt="" style={{ maxWidth: '100%', margin: '8px 0' }} />;
    default:
      return <p>{children}</p>;
  }
};

const Leaf = ({ leaf, children }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  return <span>{children}</span>;
};

function renderNode(node) {
  if (Array.isArray(node)) {
    return node.map((n, i) => renderNode(n));
  }
  if (node.text !== undefined) {
    return <Leaf key={Math.random()} leaf={node}>{node.text}</Leaf>;
  }
  const children = node.children ? node.children.map((n, i) => renderNode(n)) : null;
  return <Element key={Math.random()} element={node}>{children}</Element>;
}

export default function SlateRenderer({ value }) {
  if (!value) return null;
  let parsed;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return <div>{value}</div>;
    }
  } else {
    parsed = value;
  }
  return <div>{renderNode(parsed)}</div>;
}
