#!/usr/bin/env bash
# check-design-tokens.sh — guardrail: ensure no hardcoded Tailwind colors or hex values in app/components
# Usage: npm run check-tokens
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXIT=0

echo "🔍 Checking for hardcoded Tailwind colors..."
# Check for raw Tailwind color classes (bg-color-number, text-color-number, etc.)
RAW_COLORS=$(grep -rnE '\b(text|bg|border|ring|outline|from|to|via|fill|stroke|shadow|placeholder|accent|caret|scrollbar)-(blue|green|red|yellow|purple|pink|orange|gray|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-[0-9]+' \
  app/dashboard/ components/ --include='*.tsx' --include='*.css' 2>/dev/null || true)

if [ -n "$RAW_COLORS" ]; then
  echo -e "${RED}✗ Hardcoded Tailwind colors found:${NC}"
  echo "$RAW_COLORS"
  EXIT=1
else
  echo -e "${GREEN}✓ No hardcoded Tailwind colors${NC}"
fi

echo ""
echo "🔍 Checking for hex color values in app/components..."

HEX_COLORS=$(grep -rnE '#[0-9a-fA-F]{3,8}' app/ components/ --include='*.tsx' --include='*.css' 2>/dev/null | \
  grep -v 'globals.css' | \
  grep -v "themeColor" | \
  grep -v 'whatsapp' | \
  grep -v '#[0-9a-fA-F]{3,8}\s*//\s*allowed' || true)

if [ -n "$HEX_COLORS" ]; then
  echo -e "${RED}✗ Hex colors found outside globals.css:${NC}"
  echo "$HEX_COLORS"
  EXIT=1
else
  echo -e "${GREEN}✓ No hex colors in app/components (WhatsApp brand colors exempt)${NC}"
fi

echo ""
echo "🔍 Checking for inline touch-target patterns (should use size='touch')..."

TOUCH_INLINE=$(grep -rn 'min-h-\[44px\]' app/dashboard/ --include='*.tsx' 2>/dev/null | grep -v 'chat-input-exempt' || true)

if [ -n "$TOUCH_INLINE" ]; then
  echo -e "${RED}✗ Inline touch-target classes found (use size='touch'):${NC}"
  echo "$TOUCH_INLINE"
  EXIT=1
else
  echo -e "${GREEN}✓ No inline touch-target patterns${NC}"
fi

echo ""
echo "🔍 Checking for raw String-based color props on StatCard..."

RAW_COLOR_PROP=$(grep -rn 'color="bg-' app/ --include='*.tsx' 2>/dev/null || true)

if [ -n "$RAW_COLOR_PROP" ]; then
  echo -e "${RED}✗ Raw color strings on StatCard found (use iconColor prop):${NC}"
  echo "$RAW_COLOR_PROP"
  EXIT=1
else
  echo -e "${GREEN}✓ No raw color strings on StatCard${NC}"
fi

echo ""
echo "🔍 Checking for copy-pasted page wrappers..."

PASTE_WRAPPERS=$(grep -rn 'className="p-6 space-y-8 max-w-4xl"' app/ --include='*.tsx' 2>/dev/null | \
  grep -v 'page-shell' || true)

if [ -n "$PASTE_WRAPPERS" ]; then
  echo -e "${RED}✗ Copy-pasted page wrappers found (use PageShell):${NC}"
  echo "$PASTE_WRAPPERS"
  EXIT=1
else
  echo -e "${GREEN}✓ No copy-pasted page wrappers${NC}"
fi

echo ""
if [ $EXIT -eq 0 ]; then
  echo -e "${GREEN}✅ All design token checks passed${NC}"
else
  echo -e "${RED}❌ Design token violations found — fix before committing${NC}"
fi

exit $EXIT
