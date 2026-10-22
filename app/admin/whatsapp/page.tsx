'use client';

import { useCallback, useEffect, useState } from 'react';

interface Contact {
  id: number;
  phone: string;
  name: string;
  email: string | null;
  aiPaused: boolean;
  lastMessageAt: string | null;
}

interface Message {
  id: number;
  direction: 'in' | 'out';
  body: string;
  status: string;
  createdAt: string;
}

export default function AdminWhatsAppPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const loadContacts = useCallback(async () => {
    const res = await fetch('/api/admin/whatsapp');
    if (!res.ok) {
      setError(res.status === 401 ? 'Please sign in to view the inbox.' : 'Failed to load contacts.');
      return;
    }
    const data = await res.json();
    setContacts(data.contacts ?? []);
  }, []);

  const loadMessages = useCallback(async (contactId: number) => {
    const res = await fetch(`/api/admin/whatsapp?contact=${contactId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages ?? []);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (selected) loadMessages(selected.id);
  }, [selected, loadMessages]);

  async function toggleAi(contact: Contact) {
    await fetch('/api/admin/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId: contact.id, action: 'toggle-ai', aiPaused: !contact.aiPaused }),
    });
    const updated = { ...contact, aiPaused: !contact.aiPaused };
    setSelected(updated);
    setContacts((list) => list.map((c) => (c.id === contact.id ? updated : c)));
  }

  async function sendReply() {
    if (!selected || !draft.trim()) return;
    setSending(true);
    setError('');
    const res = await fetch('/api/admin/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId: selected.id, action: 'send', message: draft.trim() }),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to send the message.');
      return;
    }
    setDraft('');
    loadMessages(selected.id);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">WhatsApp Inbox</h1>
          <p className="text-sm text-gray-500">
            Customer conversations from the AI assistant. Pause the AI on any chat to take over.
          </p>
        </div>
        <button
          onClick={loadContacts}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg border bg-white lg:col-span-1">
          {contacts.length === 0 && (
            <p className="p-4 text-sm text-gray-500">
              No conversations yet. They appear here once customers message your WhatsApp number.
            </p>
          )}
          <ul className="divide-y">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <button
                  onClick={() => setSelected(contact)}
                  className={`block w-full p-3 text-left hover:bg-gray-50 ${
                    selected?.id === contact.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{contact.name || contact.phone}</span>
                    {contact.aiPaused && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                        AI paused
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    +{contact.phone}
                    {contact.email ? ` · ${contact.email}` : ''}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border bg-white p-4 lg:col-span-2">
          {!selected ? (
            <p className="text-sm text-gray-500">Select a conversation to view it.</p>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between border-b pb-3">
                <div>
                  <div className="font-medium">{selected.name || selected.phone}</div>
                  <div className="text-xs text-gray-500">+{selected.phone}</div>
                </div>
                <button
                  onClick={() => toggleAi(selected)}
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  {selected.aiPaused ? 'Resume AI replies' : 'Pause AI (take over)'}
                </button>
              </div>

              <div className="mb-3 max-h-[50vh] space-y-2 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.direction === 'in' ? 'bg-gray-100' : 'ml-auto bg-green-50'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.body}</p>
                    <p className="mt-1 text-right text-xs text-gray-400">
                      {new Date(message.createdAt).toLocaleString()}
                      {message.direction === 'out' ? ` · ${message.status}` : ''}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                  placeholder="Type a reply…"
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <button
                  onClick={sendReply}
                  disabled={sending || !draft.trim()}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {sending ? 'Sending…' : 'Send'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
