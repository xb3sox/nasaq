#!/usr/bin/env bash
# check-docs.sh — guardrail: ensure docs are current and within budget
# Usage: npm run check-docs
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXIT=0

echo "🔍 Checking for stale framework version references..."

BAD_NEXT=$(grep -rn 'Next\.js 16' "$ROOT/README.md" "$ROOT/SPEC.md" "$ROOT/docs/" "$ROOT/AGENTS.md" --include='*.md' 2>/dev/null || true)
BAD_NEXT_GREP=$(grep -rnF 'Next.js 16' "$ROOT/README.md" "$ROOT/SPEC.md" "$ROOT/docs/" "$ROOT/AGENTS.md" --include='*.md' 2>/dev/null || true)
if [ -n "$BAD_NEXT" ] || [ -n "$BAD_NEXT_GREP" ]; then
  echo -e "${RED}✗ Stale 'Next.js 16' reference found:${NC}"
  echo "${BAD_NEXT}${BAD_NEXT_GREP}"
  EXIT=1
else
  echo -e "${GREEN}✓ No stale Next.js 16 references${NC}"
fi

echo ""
echo "🔍 Checking for stale test count (88)..."
BAD88=$(grep -rnF '88/88' "$ROOT/README.md" "$ROOT/SPEC.md" "$ROOT/CHANGELOG.md" "$ROOT/docs/" --include='*.md' 2>/dev/null || true)
BAD88_GREP=$(grep -rnF '88 tests' "$ROOT/SPEC.md" "$ROOT/docs/" --include='*.md' 2>/dev/null || true)
if [ -n "$BAD88" ] || [ -n "$BAD88_GREP" ]; then
  echo -e "${RED}✗ Stale '88 tests' reference found:${NC}"
  echo "${BAD88}${BAD88_GREP}"
  EXIT=1
else
  echo -e "${GREEN}✓ No stale 88 test references${NC}"
fi

echo ""
echo "🔍 Checking for stale localhost port (3001)..."
BAD_PORT=$(grep -rnF 'localhost:3001' "$ROOT/README.md" "$ROOT/SPEC.md" "$ROOT/docs/" --include='*.md' 2>/dev/null || true)
if [ -n "$BAD_PORT" ]; then
  echo -e "${RED}✗ Stale 'localhost:3001' reference found:${NC}"
  echo "$BAD_PORT"
  EXIT=1
else
  echo -e "${GREEN}✓ No stale localhost:3001 references${NC}"
fi

echo ""
echo "🔍 Checking README max line count (220)..."
README_LINES=$(wc -l < "$ROOT/README.md")
if [ "$README_LINES" -gt 220 ]; then
  echo -e "${RED}✗ README.md is ${README_LINES} lines (max 220)${NC}"
  EXIT=1
else
  echo -e "${GREEN}✓ README.md is ${README_LINES} lines (within 220 limit)${NC}"
fi

echo ""
echo "🔍 Checking docs line budgets..."
for doc in "$ROOT/docs/"*.md; do
  base=$(basename "$doc")
  case "$base" in
    DOCS.md)   BUDGET=120 ;;
    COMPONENTS.md) BUDGET=280 ;;  # higher for code blocks and tables
    *)         BUDGET=180 ;;
  esac
  LINES=$(wc -l < "$doc")
  if [ "$LINES" -gt "$BUDGET" ]; then
    echo -e "${RED}✗ $base is ${LINES} lines (budget ${BUDGET})${NC}"
    EXIT=1
  else
    echo -e "${GREEN}✓ $base: ${LINES} lines (within ${BUDGET})${NC}"
  fi
done

echo ""
if [ $EXIT -eq 0 ]; then
  echo -e "${GREEN}✅ All doc checks passed${NC}"
else
  echo -e "${RED}❌ Doc drift found — fix before committing${NC}"
fi

exit $EXIT
