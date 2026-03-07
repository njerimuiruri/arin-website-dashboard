import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.demo.arin-africa.org';

/**
 * Routes a Cloudinary raw resource URL through the backend signed-url endpoint.
 * The backend generates a signed URL so the file is accessible even when the
 * Cloudinary account has access restrictions on raw resources.
 */
export function getCloudinaryDownloadUrl(url: string): string {
  if (!url) return '';
  // Only proxy Cloudinary raw resource URLs; leave other URLs unchanged.
  if (!url.includes('res.cloudinary.com')) return url;
  return `${API_BASE}/api/resources/signed-url?url=${encodeURIComponent(url)}`;
}

/**
 * Returns true only if the URL has a valid filename as its last path segment
 * (non-empty, contains a dot indicating a file extension).
 * Filters out folder-path-only URLs like .../pdfs/ or empty strings.
 */
export function isValidResourceUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  const lastSegment = (url.split('/').pop() || '').trim();
  return lastSegment.length > 0 && lastSegment.includes('.');
}

/**
 * Extracts a human-readable filename from a Cloudinary or backend resource URL.
 */
export function getResourceFilename(url: string): string {
  try {
    const lastSegment = url.split('/').pop() || '';
    return decodeURIComponent(lastSegment) || 'Resource';
  } catch {
    return url.split('/').pop() || 'Resource';
  }
}
