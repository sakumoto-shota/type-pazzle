import React from 'react';

// ESLintエラー: 未使用の変数 - 修正済み（削除）

// Formattingエラー: 不適切なインデント、セミコロンなし、スペーシング問題 - 修正済み

// TypeScriptエラー: 型の不一致
interface User {
  name: string;
  age: number;
}

const TestComponent: React.FC = () => {
  // TypeScriptエラー: 型が間違っている
  const user: User = {
    name: 'John',
    age: 25, // 型エラー修正済み
  };

  // ESLintエラー: == を使用（=== を使うべき） - 修正済み
  if (user.age === 25) {
    // console.log削除済み
  }

  // ESLintエラー: any型の使用 - 修正済み
  const badFunction = (param: unknown) => {
    return param;
  };
  // 未使用の関数を使用
  badFunction('test');

  // TypeScriptエラー: 存在しないプロパティへのアクセス - 修正済み（削除）

  // ESLintエラー: console.logの使用 - 修正済み（削除）

  // Formattingエラー: 長すぎる行 - 修正済み
  const longLine = 'This is a very long string that should be broken into multiple lines';
  // 変数を使用
  const displayText = longLine;

  return (
    <div>
      {/* ESLintエラー修正済み */}
      <h1>Test Component with Errors - Fixed</h1>
      <p>{displayText}</p>
    </div>
  );
};

// ESLintエラー: export defaultの使用（名前付きexportを推奨） - 修正済み
export { TestComponent };
