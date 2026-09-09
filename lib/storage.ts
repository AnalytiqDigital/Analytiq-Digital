import { put } from '@vercel/blob';

export async function uploadToBlob(file: File, filename?: string) {
  const blob = await put(filename || file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}
