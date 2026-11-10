/**
 * Client helper: upload an image file to the media library (Vercel Blob)
 * and return its public URL. Used by drag-drop, paste, and the dialogs.
 */
export async function uploadImage(file: File): Promise<{ url: string; alt: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', file.name);
  const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Image upload failed');
  const url = data.url || data.data?.url;
  if (!url) throw new Error('Image upload returned no URL');
  return { url, alt: file.name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ') };
}

export interface MediaItem {
  id: number;
  filename: string;
  url: string;
  altText: string | null;
  title: string | null;
}

export async function listMedia(): Promise<MediaItem[]> {
  const res = await fetch('/api/admin/media');
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not load the media library');
  return data.data || [];
}
