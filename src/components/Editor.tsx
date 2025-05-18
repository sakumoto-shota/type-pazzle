import { useState } from "react";
import MonacoEditor from "react-monaco-editor";

export default function Editor() {
  const [code, setCode] = useState<string>("");

  return (
    <MonacoEditor
      language="typescript"
      value={code}
      onChange={(value: string) => { setCode(value); }}
      options={{ automaticLayout: true }}
    />
  );
}
