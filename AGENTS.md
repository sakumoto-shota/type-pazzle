# 🤖 コントリビューターガイド（for AI Agents / Codex）

# Repository Guidelines

## Project Structure & Modules

- `pages/`: Next.js routes (`index.tsx`, `play.tsx`, `result.tsx`, API routes under `pages/api/`).
- `components/` and `src/components/`: Reusable UI (e.g., `TypeScriptEditor.tsx`, `Editor.tsx`).
- `src/hooks/`: React hooks (tests colocated as `*.test.tsx`).
- `src/utils/`: Utilities with focused unit tests (e.g., `csrf.ts`, `progress.ts`).
- `__tests__/`, `middleware.test.ts`: App-level/unit tests.
- `e2e/`: Playwright specs and helpers.
- Config: `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `tsconfig.json`.

## Build, Test, and Development

- `yarn dev`: Run the Next.js dev server.
- `yarn build` / `yarn start`: Production build and server start.
- `yarn lint`: Lint all files using ESLint config.
- `yarn tsc`: Type-check without emitting files.
- `yarn test` / `yarn test:watch`: Run unit tests with Vitest.
- `yarn test:coverage`: Generate coverage report.
- `yarn format` / `yarn format:check`: Format with Prettier or check only.
  Node 20.18+ is required (see `package.json:engines`). Pre-commit runs format, lint, type-check, and tests via Lefthook.

## Coding Style & Naming

- TypeScript everywhere; no `any`, no `console` output.
- Explicit return types; avoid non-null assertions.
- Prefer `const`; 2-space indentation; PascalCase components, camelCase functions/vars.
- Keep modules small and testable; colocate `*.test.ts[x]` next to the unit.

## Testing Guidelines

- Frameworks: Vitest + Testing Library for unit/UI; Playwright for E2E.
- File names: `*.test.ts` / `*.test.tsx`; E2E: `e2e/*.spec.ts`.
- Aim for meaningful coverage on `src/utils`, hooks, and critical pages; run `yarn test:coverage` locally.

## Commit & Pull Requests

- Commits: `feat:`, `fix:`, `test:`, `chore:`, `docs:`, `style:`, `refactor:`.
- PR title: `[type-puzzle] <short summary>`.
- PRs include: clear description, linked issues, before/after screenshots for UI, and test notes.

## Security & Middleware

- CSRF: Changes to `middleware.ts` must keep CSRF checks intact; update `middleware.test.ts` accordingly.
- Avoid leaking sensitive data; validate and narrow types at module boundaries.

## Agent-Specific Notes

- Don’t run `npm install`/`npx`; declare deps in `package.json` only.
- Don’t run `next build` or execute tests in CI locally; add function-level tests instead.
- Generate independent, typed functions with minimal surface area.

## 実行制約（for AI agents）

Codex などのオフライン実行環境では以下の制限を守ってください：

- `npm install` や `npx` を実行せず、必要な依存は `package.json` に明示するだけにとどめる
- Next.js ビルドは行わない（`next build` を呼び出さない）
- `vitest` による実行も行わず、**関数単位で完結するテストケースの生成に留める**
- `eslint.config.mjs`, `tsconfig.json`, `vitest.config.ts` など設定ファイルは出力対象に含めること

---

## コード出力ルール（for Codex）

- UI / API の構築は最小限とし、**`関数単位のモジュール`を生成対象とする**
- 関数は以下のように独立した形で出力してください：

```ts
// 例: 型検証用の関数
type User = { name: string; age: number };

export function isValidUser(u: unknown): u is User {
  return typeof u === 'object' && u !== null && 'name' in u && 'age' in u;
}
```

---

## 依存パッケージの管理

- 依存追加が必要な場合は、`package.json` の `"dependencies"` または `"devDependencies"` に追記してください
- バージョンは固定値で記述（例: `"vitest": "1.5.0"`）
- `package-lock.json` は更新対象外です（Codexでは生成・検証できません）

---

## テスト手順（※Codexは設定生成のみ、実行は不可）

- `.github/workflows` フォルダにある CI プランを見つけます。
- 以下の 3 つのチェックが自動的に実行されます：
  1. ✅ ESLint によるコード品質チェック → `.eslintrc.js` の出力のみ可能
  2. ❌ Next.js のビルドチェック（※Codexでは `next build` は実行不可）
  3. ❌ vitest によるテスト実行（※テストファイルは生成可能）

---

## PR の指示

### タイトルの形式

`[type-puzzle] <タイトル>`
PRテンプレートは `.github/PULL_REQUEST_TEMPLATE.md` を参照してください。
PRを作成するときは最新ブランチをベースにしてください。

### コミットメッセージのルール

- プレフィックス: `feat:`, `fix:`, `test:`, `chore:`, `docs:`, `style:`, `refactor:`
- 例: `feat: 型チェック機能の追加`

### コードレビューの基準

1. 型の安全性
   - TypeScript の型定義が適切か
   - 型エラーがないか

2. コード品質
   - ESLint のルールに準拠しているか
   - テストカバレッジは十分か
   - vitest によるテストを作成しているか

3. セキュリティ
   - CSRF 対策が実装されているか
   - 適切なエラーハンドリングがされているか

4. パフォーマンス
   - 不要な再レンダリングがないか
   - 適切なメモ化がされているか

---

## 🧹 コーディング規約（ESLint）

以下のESLintルールに違反しないようにコードを生成してください。
プロジェクトでは [TypeScript ESLint 公式推奨ルール](https://typescript-eslint.io/linting/configs) をベースに設定しています。

### ✅ 厳守すべきルール（コード生成時）

- `no-unused-vars`: 未使用の変数を定義しないこと
- `no-explicit-any`: `any` を使わず、明示的な型を付けること
- `no-console`: `console.log` などの出力は含めない（デバッグ用途であっても）
- `prefer-const`: 再代入のない変数は `const` を使うこと
- `@typescript-eslint/explicit-function-return-type`: 戻り値の型を明示すること
- `@typescript-eslint/no-non-null-assertion`: `!`（非nullアサーション）の使用は避けること

### 🧪 補足

- 必要に応じて `eslint.config.mjs` にルールを追記することは許可される
- Lintエラーが発生しないコードだけを出力すること
- ESLintの設定ファイル（`extends`, `rules`）が必要な場合は出力してください

### ✅ 出力例（正しいコード例）

```ts
// Bad ❌
function greet(name) {
  console.log('Hello ' + name);
}

// Good ✅
function greet(name: string): string {
  return `Hello ${name}`;
}
```
