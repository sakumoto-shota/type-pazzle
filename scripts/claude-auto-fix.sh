#!/bin/bash

# Claude Code Auto-Fix Integration Script
# This script is designed to work with Claude Code's sub-agent system

echo "🤖 Claude Code自動修正システムを起動します..."

# Check if running in Claude Code environment
if [ -n "$CLAUDE_CODE" ] || [ -f ".claude/settings.local.json" ]; then
  echo "✅ Claude Code環境を検出しました"
else
  echo "⚠️  Claude Code環境ではありません。通常の自動修正を実行します。"
  ./scripts/auto-fix.sh
  exit $?
fi

# Function to request Claude Code to fix issues
request_claude_fix() {
  local error_type=$1
  local error_details=$2
  
  cat << EOF > /tmp/claude-fix-request.md
# 自動修正リクエスト

## エラータイプ: $error_type

## エラー詳細:
\`\`\`
$error_details
\`\`\`

## 修正手順:
1. エラーメッセージを分析してください
2. 該当するファイルを特定してください
3. 必要な修正を実行してください
4. 修正後、以下のコマンドで確認してください:
   - yarn format (フォーマット)
   - yarn lint (リント)
   - yarn tsc (型チェック)
   - yarn test (テスト)

## 注意事項:
- 最小限の変更で修正してください
- 既存の機能を壊さないよう注意してください
- 修正が完了したら、変更内容を説明してください
EOF

  echo "📝 修正リクエストを作成しました: /tmp/claude-fix-request.md"
  echo "Claude Codeに修正を依頼してください。"
}

# Run checks and collect errors
ERROR_COUNT=0
ERROR_DETAILS=""

# Format check
echo "🎨 フォーマットチェック中..."
if ! yarn prettier --check "**/*.{js,jsx,ts,tsx,json,md}" 2>&1 | tee /tmp/format-errors.log; then
  ERROR_COUNT=$((ERROR_COUNT + 1))
  ERROR_DETAILS="$ERROR_DETAILS\n### フォーマットエラー:\n$(cat /tmp/format-errors.log)"
  
  # Try auto-fix
  echo "🔧 フォーマット自動修正を試みます..."
  yarn prettier --write "**/*.{js,jsx,ts,tsx,json,md}"
fi

# Lint check
echo "🔍 リントチェック中..."
if ! yarn eslint "**/*.{js,jsx,ts,tsx}" --ignore-pattern "*.test.*" --ignore-pattern "*.spec.*" 2>&1 | tee /tmp/lint-errors.log; then
  ERROR_COUNT=$((ERROR_COUNT + 1))
  ERROR_DETAILS="$ERROR_DETAILS\n### リントエラー:\n$(cat /tmp/lint-errors.log)"
  
  # Try auto-fix
  echo "🔧 リント自動修正を試みます..."
  yarn eslint --fix "**/*.{js,jsx,ts,tsx}" --ignore-pattern "*.test.*" --ignore-pattern "*.spec.*"
fi

# Type check
echo "📊 型チェック中..."
if ! yarn tsc --noEmit 2>&1 | tee /tmp/type-errors.log; then
  ERROR_COUNT=$((ERROR_COUNT + 1))
  ERROR_DETAILS="$ERROR_DETAILS\n### 型エラー:\n$(cat /tmp/type-errors.log)"
  
  # Type errors need manual fix
  echo "⚠️  型エラーは自動修正できません。Claude Codeによる修正が必要です。"
  request_claude_fix "TypeScript型エラー" "$(cat /tmp/type-errors.log)"
fi

# Test check
echo "🧪 テスト実行中..."
if ! yarn test --passWithNoTests 2>&1 | tee /tmp/test-errors.log; then
  ERROR_COUNT=$((ERROR_COUNT + 1))
  ERROR_DETAILS="$ERROR_DETAILS\n### テストエラー:\n$(cat /tmp/test-errors.log)"
  
  echo "⚠️  テストエラーがあります。修正が必要です。"
  request_claude_fix "テストエラー" "$(cat /tmp/test-errors.log)"
fi

# Summary
if [ $ERROR_COUNT -eq 0 ]; then
  echo "✅ すべてのチェックが成功しました！"
  exit 0
else
  echo "❌ $ERROR_COUNT 種類のエラーが検出されました。"
  echo -e "$ERROR_DETAILS"
  
  # Create a comprehensive fix request for Claude Code
  request_claude_fix "複合エラー ($ERROR_COUNT種類)" "$ERROR_DETAILS"
  
  echo ""
  echo "🤖 Claude Codeに修正を依頼するには:"
  echo "1. 上記のエラー内容をコピーしてください"
  echo "2. Claude Codeに以下のように依頼してください:"
  echo "   『コミット前のチェックでエラーが発生しました。以下のエラーを修正してください。』"
  echo "3. エラー内容を貼り付けてください"
  
  exit 1
fi