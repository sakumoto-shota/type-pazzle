# コントリビューターガイド

## 実行制約（for AI agents）

Codex などのオフライン実行環境では以下の制限を守ってください：

- `npm install` や `npx` を実行せず、必要な依存は `package.json` に明示するだけにとどめる
- Next.js ビルドは行わない（`next build` を呼び出さない）
- `vitest` による実行も行わず、**関数単位で完結するテストケースの生成に留める**
- `.eslintrc.js`, `tsconfig.json`, `vitest.config.ts` など設定ファイルは出力対象に含めること

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

### `package.json` に関するルール

```markdown
## 依存パッケージの管理

- 依存追加が必要な場合は、`package.json` の `"dependencies"` または `"devDependencies"` に追記してください
- バージョンは固定値で記述（例: `"vitest": "1.5.0"`）
- `package-lock.json` は更新対象外です（Codexでは生成・検証できません）

## テスト手順

- `.github/workflows` フォルダにある CI プランを見つけます。
- 以下の 3 つのチェックが自動的に実行されます：
  1. ✅ ESLint によるコード品質チェック → `.eslintrc.js` の出力のみ可能
  2. ❌ Next.js のビルドチェック（※Codexでは `next build` は実行不可）
  3. ❌ vitest によるテスト実行（※テストファイルは生成可能）

## PR の指示

タイトルの形式: `[type-puzzle] <タイトル>`

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
```
