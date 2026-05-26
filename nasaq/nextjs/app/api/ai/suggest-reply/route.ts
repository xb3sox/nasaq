import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { conversation_id } = body
  if (process.env.MOCK_MODE === 'true') {
    return NextResponse.json({ suggested_text: 'مرحبًا، شكرًا لتواصلك. متى تفضل الحضور؟', action: 'ask_question', confidence: 0.95 })
  }

  const n8nUrl = process.env.N8N_WEBHOOK_URL
  if (n8nUrl) {
    try {
      const r = await fetch(`${n8nUrl}/webhook/ai-suggest-reply`, { method: 'POST', body: JSON.stringify({ conversation_id }), headers: { 'Content-Type': 'application/json' } })
      const data = await r.json()
      return NextResponse.json(data)
    } catch (e) {
      console.error('n8n forward error', e)
      return NextResponse.json({ error: 'forward_failed' })
    }
  }

  return NextResponse.json({ error: 'no_mock_or_n8n' })
}
