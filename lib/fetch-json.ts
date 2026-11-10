/**
 * Client-side fetch helper for the admin dashboard.
 *
 * `res.json()` throws "Unexpected end of JSON input" on an empty body, which
 * hides the real problem. This reads the body as text first and turns every
 * failure mode (empty body, HTML error page, JSON `{ error }`) into a
 * readable Error carrying the server's message when there is one.
 */
export async function fetchJson<T = any>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const text = await res.text();
  if (!text) {
    throw new Error(
      res.ok
        ? 'The server returned an empty response. Check the server console for details.'
        : `Request failed (status ${res.status}). Check the server console for details.`,
    );
  }
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Unexpected server response (status ${res.status}). Check the server console for details.`,
    );
  }
  if (!res.ok) throw new Error(data.error || `Request failed (status ${res.status}).`);
  return data as T;
}
