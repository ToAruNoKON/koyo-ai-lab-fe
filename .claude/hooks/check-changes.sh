#!/usr/bin/env bash
# Stop hook: run eslint and typecheck on files Claude touched this session.
# Exit 2 with a report if anything needs fixing so asyncRewake wakes the model.

INPUT=$(cat)
SESSION=$(grep -oP '"session_id"\s*:\s*"\K[^"]+' <<< "$INPUT" | head -1)

# Cleanup session lists older than 7 days
find /tmp -maxdepth 1 -name 'claude-touched-*.txt' -mtime +7 -delete 2>/dev/null

[ -z "$SESSION" ] && exit 0

TOUCHED="/tmp/claude-touched-$SESSION.txt"
[ ! -s "$TOUCHED" ] && exit 0

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ROOT" || exit 0

FILES=$(sort -u "$TOUCHED" \
  | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|vue)$' \
  | while IFS= read -r f; do [ -f "$f" ] && echo "$f"; done)

[ -z "$FILES" ] && exit 0

ISSUES=""

ESLINT_OUT=$(echo "$FILES" | xargs ./node_modules/.bin/eslint 2>&1)
if [ $? -ne 0 ]; then
  ISSUES="ESLint issues:
$ESLINT_OUT
"
fi

PATTERN=$(echo "$FILES" | sed 's/[.]/\\./g' | tr '\n' '|' | sed 's/|$//')
TC_OUT=$(bun nuxi typecheck 2>&1 | grep -E "$PATTERN")
if [ -n "$TC_OUT" ]; then
  ISSUES="${ISSUES}TypeScript issues:
$TC_OUT
"
fi

if [ -n "$ISSUES" ]; then
  echo "Found issues in files you touched this session. Please fix them:
$ISSUES"
  exit 2
fi

exit 0
