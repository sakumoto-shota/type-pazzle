# Type Puzzle

TypeScriptの型パズルを解くアプリケーション

## ✅ 目的

TypeScript の型システムを楽しく・実践的に学ぶための教育ゲームを作成する。

- ユーティリティ型
- 条件付き型
- ジェネリクス
- 型推論
  など、実務でよく使う知識をクイズ形式で習得できる。

---

## 💡 ゲーム基本

| 要素     | 内容                                                           |
| -------- | -------------------------------------------------------------- |
| 出題形式 | `???` を含むコードを提示し、型を完成させるクイズ形式           |
| 回答方法 | ブラウザのエディタで型を記述し、「型チェック」ボタンで回答判定 |
| 判定基準 | TypeScript 型チェックでエラーが出なければ正解                  |
| 学習支援 | ヒント、解説、型エラーのハイライト表示などを予定               |

---

## 🧩 ステージ設計

各レベルから 5 問ずつ出題
クリアするごとに次のレベルへチャレンジできる

### Lv1. 型の一致

```ts
type User = ???;
const u: User = { name: "Taro", age: 20 };
```

### Lv2. ユーティリティ型の理解

```ts
type User = { name: string; age: number };
type ReadonlyUser = ???; // → Readonly<User>
```

### Lv3. ジェネリクスの活用

```ts
function identity<T>(value: T): ???;
const result = identity(123); // result: number
```

### Lv4. 条件付き型でフィルタ

```ts
type OnlyString<T> = ???;
type R = OnlyString<string | number | boolean>; // → string
```

### Lv5. 型推論の活用

```ts
type GetReturnType<T> = ???;
type R = GetReturnType<() => number>; // → number
```

## 機能

| 機能           | 技術候補                                                     |
| -------------- | ------------------------------------------------------------ |
| コードエディタ | Monaco Editor (`@monaco-editor/react`)                       |
| 型チェック     | TypeScript Compiler API (`ts.createProgram`)                 |
| UI             | React + Next + Chakra UI (`ChakraProvider`, `Button`等)      |
| 実行方法       | 「型チェック」ボタンで実行し結果欄に回答コメントが表示される |

## プロジェクトのセットアップ

本リポジトリには Next.js + TypeScript を利用したサンプル実装が含まれています。ローカルで実行するには以下のコマンドを使用します。

```bash
npm install # 依存パッケージをインストール
npm run dev # 開発サーバーを起動
```

## ライセンス

MIT License

Copyright (c) 2025 Type Puzzle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
