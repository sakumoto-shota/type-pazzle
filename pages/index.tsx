import dynamic from 'next/dynamic';
import { useState } from 'react';

// Monaco Editor is dynamically loaded to avoid SSR issues
const MonacoEditor = dynamic(() => import('react-monaco-editor'), { ssr: false });

export default function Home() {
  const [code, setCode] = useState<string>(`type User = ???;\nconst u: User = { name: "Taro", age: 20 };`);
  const [result, setResult] = useState<string>('');

  const checkType = async () => {
    try {
      // use TypeScript compiler API via dynamic import
      const ts = await import('typescript');
      const compilerHost = ts.createCompilerHost({});
      const fileName = 'index.ts';
      const program = ts.createProgram([fileName], {
        noEmit: true,
        target: ts.ScriptTarget.ESNext,
      }, {
        ...compilerHost,
        getSourceFile: (name) => {
          if (name === fileName) {
            return ts.createSourceFile(name, code, ts.ScriptTarget.ESNext, true);
          }
          return compilerHost.getSourceFile(name, ts.ScriptTarget.ESNext);
        },
        writeFile: () => {},
        getCanonicalFileName: (f) => f,
        getCurrentDirectory: () => '',
        getNewLine: () => '\n',
      });
      const diagnostics = ts.getPreEmitDiagnostics(program);
      if (diagnostics.length === 0) {
        setResult('✅ 型チェック成功!');
      } else {
        const messages = diagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n');
        setResult(messages);
      }
    } catch (e) {
      setResult('TypeScript API load error');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>TypeScript 型パズル</h1>
      <div style={{ height: '300px', marginBottom: '1em' }}>
        <MonacoEditor
          language="typescript"
          value={code}
          onChange={(value: string) => setCode(value)}
          options={{ automaticLayout: true }}
        />
      </div>
      <button onClick={checkType}>型チェック</button>
      <pre>{result}</pre>
    </div>
  );
}
