import crypto from 'node:crypto';
import { loadEdits, saveEdits } from './_store.js';
function passwordOk(given) {
  const want = process.env.EDIT_PASSWORD || '';
  if (!want || typeof given !== 'string') return false;
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(want).digest();
  return crypto.timingSafeEqual(a, b);
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, msg: 'Use POST.' });
  if (!passwordOk(req.headers['x-edit-password'])) {
    await new Promise(r => setTimeout(r, 800));   // slow down guessing
    return res.status(401).json({ ok: false, msg: 'Wrong password.' });
  }
  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch (e) { return res.status(400).json({ ok: false, msg: 'Bad request.' }); }
  const set = (body && body.set) || {}, del = (body && body.del) || [];
  if (typeof set !== 'object' || !Array.isArray(del)) return res.status(400).json({ ok: false, msg: 'Bad request.' });
  const { edits } = await loadEdits();
  for (const [k, v] of Object.entries(set)) edits[k] = v;
  for (const k of del) delete edits[k];
  const text = JSON.stringify(edits);
  if (text.length > 3_000_000) return res.status(413).json({ ok: false, msg: 'Too large.' });
  await saveEdits(edits);
  res.status(200).json({ ok: true, edits });
}
