import { Editor } from "@monaco-editor/react";
import { useState, useEffect } from "react";

export default function CodeEditor({
  language = "cpp",
  dvalue = "// write your code here",
  onChange,
  className,
  height = "350px",
}) {
   // Update local state if parent changes `dvalue`
  
  const [code, setCode] = useState(dvalue);
  
  
 // Update local state if parent changes `dvalue`
  useEffect(() => {
    setCode(dvalue);
  }, [dvalue]); 

  

  const handleCodeChange = (newValue) => {
    setCode(newValue ?? "");
    onChange?.(newValue ?? "");
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <Editor
        height={height}
        language={language}
        // value={code} // fully controlled
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
