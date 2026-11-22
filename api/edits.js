import { loadEdits } from './_store.js';
export default async function handler(req, res) {
  const { exists, edits } = await loadEdits();
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ exists, edits });
}
