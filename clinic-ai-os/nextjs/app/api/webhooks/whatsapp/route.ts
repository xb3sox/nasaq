import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  console.log('[MOCK] /api/webhooks/whatsapp', JSON.stringify(body).slice(0, 1000))

  if (process.env.MOCK_MODE === 'true') {
    return NextResponse.json({ ok: true, mock: true })
  }

  const n8nUrl = process.env.N8N_WEBHOOK_URL
  if (n8nUrl) {
    fetch(`${n8nUrl}/webhook/whatsapp`, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })
      .catch(e => console.error('forward error', e))
  }

  return NextResponse.json({ ok: true })
}
