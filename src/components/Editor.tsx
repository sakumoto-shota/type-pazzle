import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useErrorToast } from "../hooks/useErrorToast";

export default function CodeEditor() {
  const [code, setCode] = useState<string>("");
  const [csrfToken, setCsrfToken] = useState<string>("");
  const { showError } = useErrorToast();

  useEffect(() => {
    // ページロード時にCSRFトークンを取得
    const getCsrfToken = () => {
      const cookies = document.cookie.split(';');
      const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrf-token='));
      if (csrfCookie) {
        const token = csrfCookie.split('=')[1];
        setCsrfToken(token);
      }
    };
    getCsrfToken();
  }, []);

  const handleTypeCheck = async () => {
    try {
      if (!csrfToken) {
        showError(new Error('CSRFトークンが無効です'));
        return;
      }

      const response = await fetch("/api/typecheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "型チェックに失敗しました");
      }

      await response.json();
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div>
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
      <button
        onClick={handleTypeCheck}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        型チェック実行
      </button>
    </div>
  );
}
