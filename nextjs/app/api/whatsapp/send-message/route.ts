import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { to, message } = body
  console.log('[MOCK] /api/whatsapp/send-message', to, message)

  if (process.env.MOCK_MODE === 'true') {
    // Optionally persist to a file or supabase table in real repo. For now, respond ok.
    return NextResponse.json({ ok: true, mock: true })
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneId) return NextResponse.json({ error: 'missing_whatsapp_config' })

  try {
    const r = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: message } }) })
    const d = await r.json()
    return NextResponse.json(d)
  } catch (e) {
    console.error('whatsapp send error', e)
    return NextResponse.json({ error: 'send_failed' })
  }
}
