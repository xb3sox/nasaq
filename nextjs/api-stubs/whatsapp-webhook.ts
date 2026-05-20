// /api/webhooks/whatsapp (Next.js API route stub)
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const body = req.body
  console.log('[MOCK] Received whatsapp webhook', JSON.stringify(body).slice(0,1000))

  // Basic verify token support
  if (process.env.MOCK_MODE === 'true') {
    // In mock mode, simply respond 200
    return res.status(200).json({ ok: true, mock: true })
  }

  // TODO: forward to n8n webhook URL if configured
  const n8nUrl = process.env.N8N_WEBHOOK_URL
  if (n8nUrl) {
    // Fire and forget
    fetch(n8nUrl + '/webhook/whatsapp', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })
      .catch(e => console.error('forward error', e))
  }

  return res.status(200).json({ ok: true })
}
