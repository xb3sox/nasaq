#!/usr/bin/env bash
# check-design-tokens.sh — guardrail: ensure no hardcoded Tailwind colors or hex values
# Updated: checks features/ alongside app/ since routes are now thin shells.
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EXIT=0

# Search paths: app, components, features
SEARCH_PATHS="app/ components/ features/"

echo "🔍 Checking for hardcoded Tailwind colors..."
RAW_COLORS=$(grep -rnE '\b(text|bg|border|ring|outline|from|to|via|fill|stroke|shadow|placeholder|accent|caret|scrollbar)-(blue|green|red|yellow|purple|pink|orange|gray|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-[0-9]+' \
  $SEARCH_PATHS --include='*.tsx' --include='*.css' 2>/dev/null || true)

if [ -n "$RAW_COLORS" ]; then
  echo -e "${RED}✗ Hardcoded Tailwind colors found:${NC}"
  echo "$RAW_COLORS"
  EXIT=1
else
  echo -e "${GREEN}✓ No hardcoded Tailwind colors${NC}"
fi

echo ""
echo "🔍 Checking for hex color values in app/components/features..."
HEX_COLORS=$(grep -rnE '#[0-9a-fA-F]{3,8}' $SEARCH_PATHS --include='*.tsx' --include='*.css' 2>/dev/null | \
  grep -v 'globals.css' | \
  grep -v "themeColor" | \
  grep -v 'whatsapp' | \
  grep -v '#[0-9a-fA-F]{3,8}\s*//\s*allowed' || true)

if [ -n "$HEX_COLORS" ]; then
  echo -e "${RED}✗ Hex colors found outside globals.css:${NC}"
  echo "$HEX_COLORS"
  EXIT=1
else
  echo -e "${GREEN}✓ No hex colors (WhatsApp brand colors exempt)${NC}"
fi

echo ""
echo "🔍 Checking for inline touch-target patterns (should use size='touch')..."
TOUCH_INLINE=$(grep -rn 'min-h-\[44px\]' $SEARCH_PATHS --include='*.tsx' 2>/dev/null | grep -v 'chat-input-exempt' | grep -v 'components/ui/' || true)

if [ -n "$TOUCH_INLINE" ]; then
  echo -e "${RED}✗ Inline touch-target classes found (use size='touch'):${NC}"
  echo "$TOUCH_INLINE"
  EXIT=1
else
  echo -e "${GREEN}✓ No inline touch-target patterns${NC}"
fi

echo ""
echo "🔍 Checking for raw String-based color props on StatCard..."
RAW_COLOR_PROP=$(grep -rn 'color="bg-' $SEARCH_PATHS --include='*.tsx' 2>/dev/null || true)

if [ -n "$RAW_COLOR_PROP" ]; then
  echo -e "${RED}✗ Raw color strings on StatCard found (use iconColor prop):${NC}"
  echo "$RAW_COLOR_PROP"
  EXIT=1
else
  echo -e "${GREEN}✓ No raw color strings on StatCard${NC}"
fi

echo ""
echo "🔍 Checking for inline Badge color styling..."
BADGE_INLINE_COLORS=$(grep -rnE '<Badge[^>]*className="[^"]*\b(bg|text|border|hover:bg|hover:text)-' $SEARCH_PATHS --include='*.tsx' 2>/dev/null || true)

if [ -n "$BADGE_INLINE_COLORS" ]; then
  echo -e "${RED}✗ Badge inline color styling found (add/use a typed Badge or StatusBadge variant):${NC}"
  echo "$BADGE_INLINE_COLORS"
  EXIT=1
else
  echo -e "${GREEN}✓ No inline Badge color styling${NC}"
fi

echo ""
echo "🔍 Checking for copy-pasted page wrappers in features..."
PASTE_WRAPPERS=$(grep -rn 'className="p-6 space-y-8 max-w-4xl"' $SEARCH_PATHS --include='*.tsx' 2>/dev/null | grep -v 'page-shell' || true)

if [ -n "$PASTE_WRAPPERS" ]; then
  echo -e "${RED}✗ Copy-pasted page wrappers found (use PageShell):${NC}"
  echo "$PASTE_WRAPPERS"
  EXIT=1
else
  echo -e "${GREEN}✓ No copy-pasted page wrappers${NC}"
fi

echo ""
echo "🔍 Checking route shells are thin (no PageShell in route files)..."
ROUTE_SHELL=$(grep -rn '<PageShell' app/dashboard/*/page.tsx 2>/dev/null || true)

if [ -n "$ROUTE_SHELL" ]; then
  echo -e "${RED}✗ Route shells should not contain PageShell — move it into features/:${NC}"
  echo "$ROUTE_SHELL"
  EXIT=1
else
  echo -e "${GREEN}✓ Route shells are thin (no PageShell wrappers)${NC}"
fi

echo ""
echo "🔍 Checking feature components own PageShell (no double-wrap, no missing)..."
# Route shells are now thin — verify each feature has exactly one PageShell
DOUBLE_SHELLS=""
MISSING_FEAT_SHELL=""
for route in app/dashboard/*/page.tsx app/dashboard/page.tsx; do
  page_name=$(basename "$(dirname "$route")" 2>/dev/null || echo "overview")
  [[ "$page_name" == "app" || "$page_name" == "dashboard" ]] && page_name="overview"
  feat_dir="features/dashboard/${page_name}"
  if [[ -d "$feat_dir" ]]; then
    count=$(grep -rc '<PageShell' "$feat_dir" 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')
    if [[ "$count" -eq 0 ]]; then
      MISSING_FEAT_SHELL="${MISSING_FEAT_SHELL}  ${page_name} (0 PageShell in $feat_dir)\\\\n"
    elif [[ "$count" -gt 1 ]]; then
      DOUBLE_SHELLS="${DOUBLE_SHELLS}  ${page_name} (${count} PageShell in $feat_dir — double-wrap)\\\\n"
    fi
  fi
done

if [ -n "$DOUBLE_SHELLS" ]; then
  echo -e "${RED}✗ Double-wrapped features (PageShell appears >1 time):${NC}"
  echo -e "$DOUBLE_SHELLS"
  EXIT=1
elif [ -n "$MISSING_FEAT_SHELL" ]; then
  echo -e "${RED}✗ Features missing PageShell:${NC}"
  echo -e "$MISSING_FEAT_SHELL"
  EXIT=1
else
  echo -e "${GREEN}✓ All feature components have exactly one PageShell${NC}"
fi

echo ""
echo "🔍 Checking dashboard pages use PageShell (route OR feature)..."
MISSING_SHELL=""
for route in app/dashboard/*/page.tsx app/dashboard/page.tsx; do
  page_name=$(basename "$(dirname "$route")" 2>/dev/null || echo "overview")
  [[ "$page_name" == "app" || "$page_name" == "dashboard" ]] && page_name="overview"
  # Check route shell
  has_route=0
  grep -q "<PageShell" "$route" 2>/dev/null && has_route=1
  # Check matching feature dir
  feat_dir="features/dashboard/${page_name}"
  has_feat=0
  [[ -d "$feat_dir" ]] && grep -rq "<PageShell" "$feat_dir" 2>/dev/null && has_feat=1
  if [[ $has_route -eq 0 && $has_feat -eq 0 ]]; then
    MISSING_SHELL="$MISSING_SHELL  ${page_name}\\\\n"
  fi
done

if [ -n "$MISSING_SHELL" ]; then
  echo -e "${RED}✗ Dashboard pages missing PageShell:${NC}"
  echo -e "$MISSING_SHELL"
  EXIT=1
else
  echo -e "${GREEN}✓ All dashboard feature pages use PageShell${NC}"
fi

echo ""
echo "🔍 Checking scrollbar-gutter is set..."
if ! grep -q "scrollbar-gutter" app/globals.css 2>/dev/null; then
  echo -e "${RED}✗ scrollbar-gutter not found in globals.css${NC}"
  EXIT=1
else
  echo -e "${GREEN}✓ scrollbar-gutter configured${NC}"
fi

echo ""
echo "🔍 Checking auth/setup pages use CenteredPage..."
# Check feature components, not route shells
for dir in features/setup/ app/login/; do
  if [ -d "$dir" ]; then
    if grep -rq "CenteredPage" "$dir" 2>/dev/null; then
      echo -e "${GREEN}✓ $dir: uses CenteredPage${NC}"
    else
      # Check route shell for login (login wasn't extracted)
      if [ "$dir" = "app/login/" ]; then
        if ! grep -q "CenteredPage" app/login/page.tsx 2>/dev/null; then
          echo -e "${RED}✗ $dir: missing CenteredPage wrapper${NC}"
          EXIT=1
        else
          echo -e "${GREEN}✓ $dir: uses CenteredPage${NC}"
        fi
      else
        echo -e "${RED}✗ $dir: missing CenteredPage wrapper${NC}"
        EXIT=1
      fi
    fi
  fi
done

echo ""
echo "🔍 Checking landing page uses LandingSection..."
LANDING_SECTIONS=$(grep -rc "<LandingSection" features/marketing/ 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')
if [ "$LANDING_SECTIONS" -ge 5 ] 2>/dev/null; then
  echo -e "${GREEN}✓ Landing page uses LandingSection (${LANDING_SECTIONS} sections)${NC}"
else
  echo -e "${RED}✗ Landing page has only ${LANDING_SECTIONS} LandingSection usages (expected 5+)${NC}"
  EXIT=1
fi

echo ""
if [ $EXIT -eq 0 ]; then
  echo -e "${GREEN}✅ All design token checks passed${NC}"
else
  echo -e "${RED}❌ Design token violations found — fix before committing${NC}"
fi

exit $EXIT
