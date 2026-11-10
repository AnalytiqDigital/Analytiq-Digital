import { put } from '@vercel/blob';

export async function uploadToBlob(file: File, filename?: string) {
  const blob = await put(filename || file.name, file, {
    access: 'public',
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_TOKEN,
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
  };
}
