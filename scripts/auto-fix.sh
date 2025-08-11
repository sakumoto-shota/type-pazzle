#!/bin/bash

# Auto-fix script for pre-commit errors
# This script attempts to automatically fix common issues

echo "🔧 自動修正を開始します..."

# Format fix
if yarn prettier --write "**/*.{js,jsx,ts,tsx,json,md}"; then
  echo "✅ フォーマット修正完了"
else
  echo "❌ フォーマット修正に失敗"
  exit 1
fi

# Lint fix
if yarn eslint --fix "**/*.{js,jsx,ts,tsx}" --ignore-pattern "*.test.*" --ignore-pattern "*.spec.*"; then
  echo "✅ リント修正完了"
else
  echo "❌ リント修正に失敗"
fi

# Type check (can't auto-fix, just report)
if yarn tsc --noEmit; then
  echo "✅ 型チェック成功"
else
  echo "⚠️  型エラーがあります。手動修正が必要です。"
  echo "Claude Codeに修正を依頼することをお勧めします。"
fi

echo "🎉 自動修正が完了しました。変更をステージングしてください："
echo "  git add -A"
echo "  git commit -m 'your message'"