#!/bin/bash

# Code Reviewer Sub-agent Invocation Script
# This script triggers the code-reviewer sub-agent when pre-commit errors are detected

echo "🤖 Code Reviewer エージェントを起動します..."

# Collect all error information
ERROR_FILES=""
HAS_FORMAT_ERROR=false
HAS_LINT_ERROR=false
HAS_TYPE_ERROR=false
HAS_TEST_ERROR=false

# Check for formatting errors
if ! yarn prettier --check {staged_files} 2>/dev/null; then
  HAS_FORMAT_ERROR=true
  ERROR_FILES="$ERROR_FILES $(yarn prettier --check {staged_files} 2>&1 | grep -E '^\[warn\]' | sed 's/\[warn\]//' | xargs)"
fi

# Check for lint errors
if ! yarn eslint {staged_files} 2>/dev/null; then
  HAS_LINT_ERROR=true
fi

# Check for type errors
if ! yarn tsc --noEmit 2>/dev/null; then
  HAS_TYPE_ERROR=true
fi

# If any errors exist, invoke the code-reviewer agent
if [ "$HAS_FORMAT_ERROR" = true ] || [ "$HAS_LINT_ERROR" = true ] || [ "$HAS_TYPE_ERROR" = true ]; then
  echo "📝 エラーが検出されました。Code Reviewerエージェントに修正を依頼します..."
  
  # Create error report for the agent
  cat << EOF > /tmp/pre-commit-errors.md
# Pre-commit エラーレポート

## 検出されたエラー:
- フォーマットエラー: $HAS_FORMAT_ERROR
- Lintエラー: $HAS_LINT_ERROR
- 型エラー: $HAS_TYPE_ERROR

## 対象ファイル:
$ERROR_FILES

## 修正が必要な項目:
EOF

  if [ "$HAS_FORMAT_ERROR" = true ]; then
    echo "### フォーマットエラー:" >> /tmp/pre-commit-errors.md
    yarn prettier --check {staged_files} 2>&1 >> /tmp/pre-commit-errors.md
  fi
  
  if [ "$HAS_LINT_ERROR" = true ]; then
    echo "### Lintエラー:" >> /tmp/pre-commit-errors.md
    yarn eslint {staged_files} 2>&1 >> /tmp/pre-commit-errors.md
  fi
  
  if [ "$HAS_TYPE_ERROR" = true ]; then
    echo "### 型エラー:" >> /tmp/pre-commit-errors.md
    yarn tsc --noEmit 2>&1 >> /tmp/pre-commit-errors.md
  fi

  # Trigger the code-reviewer agent through Claude Code
  echo ""
  echo "🔧 Code Reviewerエージェントによる自動修正を開始します..."
  echo ""
  echo "以下のコマンドをClaude Codeで実行してください:"
  echo "/agent code-reviewer"
  echo ""
  echo "または、以下のプロンプトを使用してください:"
  echo "『pre-commitでエラーが検出されました。code-reviewerエージェントを使用して自動修正してください。』"
  echo ""
  echo "エラーの詳細は /tmp/pre-commit-errors.md に保存されました。"
  
  # Exit with error to prevent commit
  exit 1
else
  echo "✅ すべてのチェックに合格しました！"
  exit 0
fi