#!/usr/bin/env bash
set -euo pipefail
shopt -s globstar

# Architecture guardrail — warns on legacy debt, fails on regression.
# Baseline file: scripts/architecture-baseline.json

BASELINE="scripts/architecture-baseline.json"
TARGET_DASHBOARD=80
TARGET_LANDING=40

declare -A TARGETS=(
  ["app/page.tsx"]="$TARGET_LANDING"
)

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

FAILED=0
WARNED=0

echo "🔍 Checking route page sizes..."

# Load baseline
if [[ ! -f "$BASELINE" ]]; then
  echo "⚠️  No baseline file. Run generation first."
  exit 0
fi

baseline_val() {
  python3 -c "import json; d=json.load(open('$BASELINE')); print(d.get('$1', 0))"
}

# Collect unique page files (globstar may double-match app/page.tsx)
while IFS= read -r -d '' file; do
  lines=$(wc -l < "$file")
  target="${TARGETS[$file]:-$TARGET_DASHBOARD}"
  bl=$(baseline_val "$file")

  if [[ $lines -gt $target ]]; then
    if [[ $bl -eq 0 ]]; then
      # New file over target
      echo -e "  ${RED}FAIL${NC} $file: $lines LOC (new, exceeds target $target)"
      FAILED=1
    elif [[ $lines -gt $bl ]]; then
      # Grew above baseline
      echo -e "  ${RED}FAIL${NC} $file: $lines LOC (grew from baseline $bl, target $target)"
      FAILED=1
    elif [[ $lines -eq $bl ]]; then
      # Still fat but not worse
      echo -e "  ${YELLOW}WARN${NC} $file: $lines LOC (unchanged, exceeds target $target)"
      WARNED=1
    else
      # Shrunk but still over target
      echo -e "  ${YELLOW}WARN${NC} $file: $lines LOC (improved from $bl, still over target $target)"
      WARNED=1
    fi
  elif [[ $bl -gt 0 && $lines -lt $bl ]]; then
    echo -e "  ${GREEN}OK${NC} $file: $lines LOC (improved from $bl)"
  else
    echo -e "  ${GREEN}OK${NC} $file: $lines LOC (within target $target)"
  fi
done < <(find app -name 'page.tsx' -print0 | sort -uz)

echo ""
echo "🔍 Checking for root .jules/"
if [[ -d ".jules" ]]; then
  echo -e "  ${RED}FAIL${NC} Root .jules/ directory exists. Move to .hermes/jules/"
  FAILED=1
else
  echo -e "  ${GREEN}OK${NC} No root .jules/"
fi

echo ""
echo "🔍 Checking for duplicate plan files"
dup=$(python3 -c "
from pathlib import Path
root=Path('.hermes/plans')
top={p.name for p in root.glob('*.md') if p.name!='README.md'}
archived={p.name for p in (root/'archive').glob('*.md')}
dup=sorted(top & archived)
for d in dup:
    print(d)
")
if [[ -n "$dup" ]]; then
  echo -e "  ${RED}FAIL${NC} Duplicate plan files: $dup"
  FAILED=1
else
  echo -e "  ${GREEN}OK${NC} No duplicate plan files"
fi

echo ""
echo "🔍 Checking for new legacy demo-clinic imports"
# Count occurrences (excluding known safe files)
IMPORTS=$(grep -rl "from.*demo-clinic" lib/ app/ 2>/dev/null | grep -v "lib/demo-clinic.ts" | grep -v "tests/" || true)
if [[ -n "$IMPORTS" ]]; then
  echo -e "  ${YELLOW}WARN${NC} demo-clinic imports still in use (allowed while shim exists):"
  echo "$IMPORTS" | while read f; do echo "    $f"; done
else
  echo -e "  ${GREEN}OK${NC} No demo-clinic consumer imports"
fi

echo ""
if [[ $FAILED -eq 1 ]]; then
  echo -e "${RED}❌ Architecture check failed${NC}"
  exit 1
elif [[ $WARNED -eq 1 ]]; then
  echo -e "${YELLOW}⚠️  Architecture check passed with warnings${NC}"
  exit 0
else
  echo -e "${GREEN}✅ Architecture check passed${NC}"
  exit 0
fi
