'use client';

import { useEffect, useState, useCallback } from 'react';

interface Settings {
  id: number;
  companyName: string;
  tagline: string;
  logoUrl: string;
  phone: string | null;
  email: string;
  address: string;
  socialLinks: { linkedin?: string; x?: string; instagram?: string; facebook?: string };
  googlePlaceId: string | null;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSettings(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSettings(data.data);
      setMessage('Settings saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return <p className="text-sm text-ink/50">Loading…</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Website Settings</h1>
      <p className="mt-1 text-sm text-ink/60">Company info, contact details, and SEO defaults.</p>

      {message && <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}</p>}
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Company name</label>
            <input
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Tagline</label>
            <input
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
            <input
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Phone</label>
            <input
              value={settings.phone || ''}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Address</label>
          <textarea
            rows={2}
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">LinkedIn URL</label>
            <input
              value={settings.socialLinks.linkedin || ''}
              onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">X (Twitter) URL</label>
            <input
              value={settings.socialLinks.x || ''}
              onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, x: e.target.value } })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Google Place ID</label>
          <input
            value={settings.googlePlaceId || ''}
            onChange={(e) => setSettings({ ...settings, googlePlaceId: e.target.value })}
            placeholder="ChIJ..."
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink/50">
            Used for local SEO structured data. Live review syncing also needs GOOGLE_PLACES_API_KEY set as a
            server environment variable (not stored here, for security).
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Default SEO title</label>
          <input
            value={settings.seoDefaultTitle || ''}
            onChange={(e) => setSettings({ ...settings, seoDefaultTitle: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Default SEO description</label>
          <textarea
            rows={2}
            value={settings.seoDefaultDescription || ''}
            onChange={(e) => setSettings({ ...settings, seoDefaultDescription: e.target.value })}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
