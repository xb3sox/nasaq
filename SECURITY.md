# Security Policy

## Supported branch

Security fixes target `main` first. Feature branches must rebase after security changes land.

## Reporting vulnerabilities

Do **not** open public issues for secrets, auth bypasses, patient-data exposure, webhook signature bugs, or production credential leaks.

Report privately to the repository owner through GitHub private channels or direct maintainer contact.

## Security baseline

- No secrets in code, tests, docs, fixtures, screenshots, or commit messages.
- Runtime status endpoints may expose readiness flags and missing variable names only — never values.
- WhatsApp integration uses Meta Cloud API only. No WhatsApp Web scraping.
- AI must route medical advice and diagnosis requests to a human.
- Supabase writes go through the adapter pattern and RLS-backed schema.
- Production webhooks must validate Meta signatures.
- Demo API access must be explicitly gated by environment variables.

## Required verification for security-sensitive changes

```bash
npm audit --audit-level=moderate
npm test
npm run lint
npm run build
```

Security-sensitive PRs require manual review. No auto-merge.
