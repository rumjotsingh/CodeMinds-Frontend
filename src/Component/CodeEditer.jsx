"use client";

import Editor from "@monaco-editor/react";
import React, { useState, useEffect } from "react";

export default function CodeEditor({
  language = "cpp",
  value = "// write your code here",
  onChange,
  className,
  height = "350px",
}) {
  const [code, setCode] = useState(value);

  useEffect(() => {
    setCode(value);
  }, [value]);

  const handleCodeChange = (newValue /* string | undefined */) => {
    const updatedCode = newValue ?? "";
    setCode(updatedCode);
    if (onChange) onChange(updatedCode);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <Editor
        height={height}
        language={language}
        value={code}
        theme="vs-dark"
        onChange={handleCodeChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          wordWrap: "on",
          tabSize: 4,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
