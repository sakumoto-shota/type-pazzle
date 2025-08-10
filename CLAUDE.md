# プロジェクト情報

## 概要

React で構築されたタスク管理アプリケーション

## 技術スタック

- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express + Prisma
- Database: PostgreSQL
- Testing: Jest + React Testing Library + Playwright

## 開発コマンド

- 開発サーバー: `yarn dev`
- テスト実行: `yarn test`
- E2E テスト: `yarn test:e2e`
- ビルド: `yarn build`
- 型チェック: `yarn type-check`

## コーディング規約

- 関数はアロー関数で統一
- コンポーネントは PascalCase
- ファイル名は kebab-case
- CSS は Tailwind CSS 使用

## 重要なルール

- 新機能追加時は必ずテストも作成
- TypeScript の厳密モードを維持
- コミット前に必ず lint + type-check を実行
- テストを実行する時は競合ポートがあれば、終了してチェックすること
