import MonacoEditor from "react-monaco-editor";
import { useState } from "react";

export default function Editor() {
  const [code, setCode] = useState<string>("");

  return (
    <MonacoEditor
      language="typescript"
      value={code}
      onChange={(value: string) => setCode(value)}
      options={{ automaticLayout: true }}
    />
  );
}
