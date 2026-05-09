#!/usr/bin/env bash
# PostToolUse hook for Edit|Write: fast format with prettier.
# Uses local prettier (~250ms) instead of eslint --fix (~1s+) to keep edits snappy.

INPUT=$(cat)
FILE=$(grep -oP '"file_path"\s*:\s*"\K[^"]+' <<< "$INPUT" | head -1)

[ -z "$FILE" ] && exit 0

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
PRETTIER="$ROOT/node_modules/.bin/prettier"

[ -x "$PRETTIER" ] || exit 0

case "$FILE" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.mts|*.cts|*.vue|*.json|*.css|*.scss|*.md|*.yml|*.yaml)
    "$PRETTIER" --write --log-level=warn --ignore-unknown "$FILE" 2>/dev/null
    ;;
esac

exit 0
