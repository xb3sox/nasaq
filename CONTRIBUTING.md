# Contributing to Nasaq

Nasaq is an Arabic-first clinic workflow product. Shipping quality matters more than clever diffs.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Demo mode works without production credentials.

## Quality gate

Run the full gate before pushing code:

```bash
npm test
npm run lint
npm run build
```

## Branches

- `jules/*` — bounded Jules automation branches.
- `sabi/*` — local agent/user integration branches.
- `feat/*`, `fix/*`, `docs/*`, `ci/*` — normal human branches.

`main` should stay deployable.

## Product rules

- Arabic-first UI copy.
- RTL-aware layout using logical utilities: `start/end`, `ms/me`, `ps/pe`.
- No hardcoded secrets, demo credentials, API tokens, patient data, or medical diagnosis advice.
- WhatsApp integration must use Meta Cloud API only.
- New behavior needs tests or a clear reason why not.

## PR rules

Every PR should include:

- Summary
- Test evidence
- Product impact
- Screenshots for UI changes
- Security/env notes when relevant

Jules PRs may auto-merge only when narrowly scoped and green. Everything else gets manual review.
