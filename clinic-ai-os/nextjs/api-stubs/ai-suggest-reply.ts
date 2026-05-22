// /api/ai/suggest-reply (Next.js API route stub)
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { conversation_id } = req.body
  // In mock mode, return canned Arabic reply
  if (process.env.MOCK_MODE === 'true') {
    return res.status(200).json({ suggested_text: 'مرحبًا، شكرًا لتواصلك. متى تفضل الحضور؟', action: 'ask_question', confidence: 0.95 })
  }

  // Otherwise forward to n8n webhook if present
  const n8nUrl = process.env.N8N_WEBHOOK_URL
  if (n8nUrl) {
    try {
      const r = await fetch(n8nUrl + '/webhook/ai-suggest-reply', { method: 'POST', body: JSON.stringify({ conversation_id }), headers: { 'Content-Type': 'application/json' } })
      const data = await r.json()
      return res.status(200).json(data)
    } catch (e) {
      console.error('n8n forward error', e)
      return res.status(500).json({ error: 'forward_failed' })
    }
  }

  return res.status(400).json({ error: 'no_mock_or_n8n' })
}
