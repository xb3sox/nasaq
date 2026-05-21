# HEARTBEAT.md

Keep proactive checks low-noise. Stay quiet unless something matters.

## Routine Checks

- Check urgent unread email and calendar only during waking hours.
- Check weather only when travel/outdoor context exists.
- If nothing changed or the last check was recent, reply `HEARTBEAT_OK`.

## Daily Maintenance Tasks

Use `tasks:` block with due-only interval checks. HEARTBEAT_OK if nothing due.

- name: memory-distill
  interval: 1d
  prompt: "Read memory/YYYY-MM-DD.md (today's log). Distill durable facts → MEMORY.md. Commit if changed."

- name: config-drift-check
  interval: 1d
  prompt: "Quick scan of .openclaw/openclaw.json and workspace git status. Flag any drift. HEARTBEAT_OK if clean."

- name: compaction-audit
  interval: 3d
  prompt: "Check /status for compaction count. If >2 compactions in last 7 days, flag in next reply. HEARTBEAT_OK if fine."