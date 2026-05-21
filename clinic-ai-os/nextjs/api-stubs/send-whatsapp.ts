// /api/whatsapp/send-message (Next.js API route stub)
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { to, message } = req.body
  console.log('[MOCK] send-whatsapp', to, message)
  if (process.env.MOCK_MODE === 'true') {
    // store to local file or just log
    return res.status(200).json({ ok: true, mock: true })
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneId) return res.status(500).json({ error: 'missing_whatsapp_config' })

  // call Meta WhatsApp API
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message }
  }

  try {
    const r = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    const d = await r.json()
    return res.status(200).json(d)
  } catch (e) {
    console.error('whatsapp send error', e)
    return res.status(500).json({ error: 'send_failed' })
  }
}
