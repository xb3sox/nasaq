# Nasaq Documentation Map

**Purpose:** Who owns what, when to update it, and how to keep docs lean.
**Edit trigger:** Adding a new doc, noticing stale info in a doc, or changing a doc-adjacent code path.

## Doc inventory

| Doc | Purpose | Owner | Max lines |
|-----|---------|-------|-----------|
| `README.md` | Product pitch, quickstart, status, roadmap, top-of-repo entrypoint | Maintainer | 220 |
| `AGENTS.md` | Agent runtime rules | Agent authors | — |
| `CONTRIBUTING.md` | PR workflow, branch rules, quality gate | Maintainer | — |
| `SECURITY.md` | Security policy and contacts | Maintainer | — |
| `CHANGELOG.md` | Release history | Maintainer | — |
| `app/globals.css` | CSS custom properties — design token source of truth | Lead dev | — |
| `SPEC.md` | Current MVP state + active task queue | Maintainer | — |
| `docs/DOCS.md` | This doc — ownership map | Maintainer | 120 |
| `docs/ARCHITECTURE.md` | Folder boundaries, data flow, route thinness | Maintainer | 180 |
| `docs/COMPONENTS.md` | Current UI primitives contract | UI lead | 280 |
| `docs/OPERATIONS.md` | Env, deploy, Supabase, WhatsApp, n8n runbook | Maintainer | 180 |

## Token-budget rules

- README ≤ 220 lines. Setup details belong in `docs/OPERATIONS.md`.
- `docs/*.md` ≤ 180 lines unless explicitly allowlisted above.
- No full env variable tables outside `.env.example`. README links to `.env.example`.
- No historical implementation journals in hot docs. Move those to `CHANGELOG.md` or `.hermes/plans/archive/`.
- Every doc starts with: purpose, edit trigger, cross-reference to related docs.

## Stale-doc checklist

When editing any source code, scan for:
- [ ] Does any doc reference wrong framework versions?
- [ ] Does any doc reference wrong test count?
- [ ] Does any doc reference wrong default localhost port?
- [ ] Does any doc reference `features/` (target architecture, not current)?
- [ ] Does any doc duplicate `.env.example` variables?
- [ ] Is the doc over its line budget?

Run `npm run check-docs` before pushing to catch known drift patterns automatically.

## Guards

- `scripts/check-docs.sh` — automated stale-content checks.
- `npm run verify` runs tests + lint + build + check-tokens + check-docs.
- The PR template has a docs checklist section. Fill it.
