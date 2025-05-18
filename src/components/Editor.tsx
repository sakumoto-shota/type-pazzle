import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  const [code, setCode] = useState<string>("");

  return (
    <Editor
      height="90vh"
      defaultLanguage="typescript"
      defaultValue="// TypeScript code here"
      onChange={(value) => setCode(value || "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
      }}
    />
  );
}
