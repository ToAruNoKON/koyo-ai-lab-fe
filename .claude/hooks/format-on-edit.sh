#!/usr/bin/env bash
# PostToolUse hook for Edit|Write:
#   1. Record the touched file in a session-scoped list (consumed by Stop hook)
#   2. Fast-format with local prettier (~150ms vs ~1s for eslint --fix)

INPUT=$(cat)
FILE=$(grep -oP '"file_path"\s*:\s*"\K[^"]+' <<< "$INPUT" | head -1)
SESSION=$(grep -oP '"session_id"\s*:\s*"\K[^"]+' <<< "$INPUT" | head -1)

[ -z "$FILE" ] && exit 0

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0

# Track only files inside this repo, as project-relative paths
case "$FILE" in
  "$ROOT"/*)
    RELATIVE="${FILE#$ROOT/}"
    [ -n "$SESSION" ] && echo "$RELATIVE" >> "/tmp/claude-touched-$SESSION.txt"
    ;;
esac

PRETTIER="$ROOT/node_modules/.bin/prettier"
[ -x "$PRETTIER" ] || exit 0

case "$FILE" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.mts|*.cts|*.vue|*.json|*.css|*.scss|*.md|*.yml|*.yaml)
    "$PRETTIER" --write --log-level=warn --ignore-unknown "$FILE" 2>/dev/null
    ;;
esac

exit 0
