#!/usr/bin/env bash
# Stop hook: run eslint and typecheck on changed files. Exit 2 with a report
# if anything needs fixing so asyncRewake wakes the model.

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

FILES=$( { git diff --name-only HEAD 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null; } \
  | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|vue)$' \
  | sort -u \
  | while IFS= read -r f; do [ -f "$f" ] && echo "$f"; done)

[ -z "$FILES" ] && exit 0

ISSUES=""

ESLINT_OUT=$(echo "$FILES" | xargs npx eslint 2>&1)
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
  echo "Found issues in changed files. Please fix them:
$ISSUES"
  exit 2
fi

exit 0
