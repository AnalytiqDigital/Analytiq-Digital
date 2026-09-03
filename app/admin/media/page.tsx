// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import Image from 'next/image';
// import { Upload, Copy, Trash2 } from 'lucide-react';

// interface MediaItem {
//   id: number;
//   filename: string;
//   url: string;
//   altText: string | null;
//   title: string | null;
//   createdAt: string;
// }

// export default function AdminMediaPage() {
//   const [items, setItems] = useState<MediaItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [copiedId, setCopiedId] = useState<number | null>(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/admin/media/upload');
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error);
//       setItems(data.data || []);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load media');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('title', file.name);

//     try {
//       const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Upload failed');
//       await load();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Upload failed');
//     } finally {
//       setUploading(false);
//       e.target.value = '';
//     }
//   }

//   function copyUrl(item: MediaItem) {
//     navigator.clipboard.writeText(item.url);
//     setCopiedId(item.id);
//     setTimeout(() => setCopiedId(null), 1500);
//   }

//   return (
//     <div>
//       <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-bold text-ink">Media Library</h1>
//           <p className="mt-1 text-sm text-ink/60">
//             Upload images, then copy the URL into any Image URL field elsewhere in the admin.
//           </p>
//         </div>
//         <label className="btn-primary cursor-pointer">
//           <Upload size={16} className="mr-1.5" />
//           {uploading ? 'Uploading…' : 'Upload image'}
//           <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={handleUpload} disabled={uploading} className="hidden" />
//         </label>
//       </div>

//       <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
//         Files are stored on local disk for development. Before deploying to a serverless platform like Vercel,
//         switch this to object storage (Vercel Blob, S3, Cloudinary) — see the README.
//       </div>

//       {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

//       {loading ? (
//         <p className="text-sm text-ink/50">Loading…</p>
//       ) : items.length === 0 ? (
//         <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink/50">
//           No files uploaded yet.
//         </p>
//       ) : (
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//           {items.map((item) => (
//             <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
//               <div className="relative aspect-square bg-surface-off">
//                 <Image src={item.url} alt={item.altText || item.title || item.filename} fill className="object-cover" />
//               </div>
//               <div className="p-2">
//                 <p className="truncate text-xs font-medium text-ink/70">{item.title || item.filename}</p>
//                 <button
//                   type="button"
//                   onClick={() => copyUrl(item)}
//                   className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface-off px-2 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10"
//                 >
//                   <Copy size={12} /> {copiedId === item.id ? 'Copied!' : 'Copy URL'}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, Copy, Trash2 } from 'lucide-react';

interface MediaItem {
  id: number;
  filename: string;
  url: string;
  altText: string | null;
  title: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  // function copyUrl(item: MediaItem) {
  //   if (navigator.clipboard && window.isSecureContext) {
  //     navigator.clipboard.writeText(item.url);
  //     setCopiedId(item.id);
  //     setTimeout(() => setCopiedId(null), 1500);
  //   } else {
  //     const textArea = document.createElement('textarea');
  //     textArea.value = item.url;
  //     textArea.style.position = 'absolute';
  //     textArea.style.left = '-999999px';
  //     document.body.appendChild(textArea);
  //     textArea.focus();
  //     textArea.select();

  //     try {
  //       document.execCommand('copy');
  //       setCopiedId(item.id);
  //       setTimeout(() => setCopiedId(null), 1500);
  //     } catch (err) {
  //       console.error('Fallback: Oops, unable to copy', err);
  //       alert('Clipboard access blocked. Please copy manually: ' + item.url);
  //     }
      
  //     document.body.removeChild(textArea);
  //   }
  // }

  function copyUrl(item: MediaItem) {
    // This line grabs your current domain (e.g. http://localhost:3000) 
    // and attaches it to the front of the image path
    const fullUrl = new URL(item.url, window.location.origin).toString();

    if (navigator.clipboard && window.isSecureContext) {
      // Notice we are copying fullUrl now instead of item.url
      navigator.clipboard.writeText(fullUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl; // And here too
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 1500);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Clipboard access blocked. Please copy manually: ' + fullUrl);
      }
      
      document.body.removeChild(textArea);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Media Library</h1>
          <p className="mt-1 text-sm text-ink/60">
            Upload images, then copy the URL into any Image URL field elsewhere in the admin.
          </p>
        </div>
        <label className="btn-primary cursor-pointer">
          <Upload size={16} className="mr-1.5" />
          {uploading ? 'Uploading…' : 'Upload image'}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Files are stored on local disk for development. Before deploying to a serverless platform like Vercel,
        switch this to object storage (Vercel Blob, S3, Cloudinary) — see the README.
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-ink/50">
          No files uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="relative aspect-square bg-surface-off">
                <Image src={item.url} alt={item.altText || item.title || item.filename} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-cover" />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-ink/70">{item.title || item.filename}</p>
                <button
                  type="button"
                  onClick={() => copyUrl(item)}
                  className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface-off px-2 py-1.5 text-xs font-semibold text-brand hover:bg-brand/10"
                >
                  <Copy size={12} /> {copiedId === item.id ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}