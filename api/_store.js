// Shared edits are kept as one JSON file in Vercel Blob storage.
import { put, head } from '@vercel/blob';
export const NAME = 'chiasm-edits.json';
export async function loadEdits() {
  try {
    const h = await head(NAME);
    const r = await fetch(h.url + '?v=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return { exists: false, edits: {} };
    return { exists: true, edits: await r.json() };
  } catch (e) {
    return { exists: false, edits: {} };   // no edits saved yet
  }
}
export async function saveEdits(edits) {
  await put(NAME, JSON.stringify(edits), {
    access: 'public', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'application/json', cacheControlMaxAge: 60,
  });
}
