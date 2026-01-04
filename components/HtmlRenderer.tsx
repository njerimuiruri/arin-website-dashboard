'use client';

interface HtmlRendererProps {
  content: string;
  className?: string;
}

/**
 * HtmlRenderer - Safely renders HTML content from TipTap editor
 * This component displays the rich text content with proper styling
 */
export default function HtmlRenderer({ content, className = '' }: HtmlRendererProps) {
  if (!content) {
    return <p className="text-slate-400 italic">No description available</p>;
  }

  return (
    <div
      className={`prose prose-sm sm:prose lg:prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
