# n8n Reminders Workflow

Automatically sends queued WhatsApp reminders via the Nasaq API.

## Import

1. Open n8n → **Import from File** → select `reminders-sender.json`
2. The workflow imports with all nodes and connections pre-configured

## Environment Variables

Set these in your n8n instance (not in the workflow):

| Variable | Description |
|---|---|
| `APP_URL` | Nasaq production URL (e.g., `https://nasaq.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (not anon key) |

## How It Works

```
Cron (every 15min) → Query pending reminders → Split per item → Send WhatsApp → Mark sent/failed
```

1. **Cron** triggers every 15 minutes
2. **Query Reminders** fetches pending reminders from Supabase where `send_at <= now()`
3. **Split** processes one reminder at a time
4. **Send WhatsApp** calls `POST /api/messages/send` with the reminder's phone and template
5. **Mark Sent** updates `status=sent` on success
6. **Mark Failed** updates `status=failed` on error

## Activation

Toggle the workflow **Active** in n8n after importing and setting env vars.
