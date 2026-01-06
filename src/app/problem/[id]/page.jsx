'use client';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProblemsById,
  runCode,
  submitCode,
  clearRunResult,
  clearSubmitResult,
} from "../../../redux/slices/problemSlice";
import { fetchComments } from "../../../redux/slices/commentsSlice";
import { fetchSubmissionsByProblemById } from "../../../redux/slices/submissionSlice";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Play, Upload, Check, Shuffle, FileText, Code2, History } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/context/authContext';
import Editor from "@monaco-editor/react";

function getMonacoLanguage(lang) {
  switch (lang?.toUpperCase()) {
    case "PYTHON": return "python";
    case "C++":
    case "CPP": return "cpp";
    case "JAVASCRIPT": return "javascript";
    case "JAVA": return "java";
    default: return "cpp";
  }
}

function getLanguageId(lang) {
  switch (lang?.toUpperCase()) {
    case "PYTHON": return 71;
    case "CPP":
    case "C++": return 54;
    case "JAVASCRIPT": return 63;
    case "JAVA": return 62;
    default: return 54;
  }
}

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  
  const {
    getById: problem,
    status,
    error,
    runStatus,
    runResult,
    runError,
    submitStatus,
    submitResult,
  } = useSelector((state) => state.problem);
  
  const { problemSubmission } = useSelector((state) => state.submissions);
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("description");
  const [lang, setLang] = useState("C++");
  const [sourceCode, setSourceCode] = useState("");
  const [consoleTab, setConsoleTab] = useState("testcase");
  const [consoleOpen, setConsoleOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchProblemsById(id));
    dispatch(fetchComments(id));
    dispatch(fetchSubmissionsByProblemById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (lang && problem?.codeSnippets) {
      const code = problem.codeSnippets[lang] || problem.codeSnippets["C++"] || "";
      setSourceCode(code);
    }
  }, [lang, problem]);

  useEffect(() => {
    if (runResult) setConsoleTab("result");
    if (runError) toast.error(runError);
  }, [runResult, runError]);

  useEffect(() => {
    if (submitStatus === "succeeded") {
      toast.success("Submission successful!");
      setConsoleTab("result");
    }
  }, [submitStatus]);

  const handleRun = () => {
    if (!sourceCode.trim()) {
      toast.error("Please write code before running.");
      return;
    }
    if (!authLoading && !isAuthenticated) {
      toast.error("You must be logged in to run code");
      router.push("/login");
      return;
    }
    dispatch(clearRunResult());
    dispatch(runCode({ problemId: id, languageId: getLanguageId(lang), sourceCode }));
  };

  const handleSubmit = () => {
    if (!sourceCode.trim()) {
      toast.error("Please write code before submitting.");
      return;
    }
    if (!authLoading && !isAuthenticated) {
      toast.error("You must be logged in to submit code");
      router.push("/login");
      return;
    }
    dispatch(clearSubmitResult());
    dispatch(submitCode({ problemId: id, languageId: getLanguageId(lang), sourceCode }));
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case "EASY": return "text-[#00b8a3]";
      case "MEDIUM": return "text-[#ffc01e]";
      case "HARD": return "text-[#ff375f]";
      default: return "text-[#00b8a3]";
    }
  };

  if (status === "loading") {
    return (
      <div className="h-[calc(100vh-56px)] flex bg-[#1a1a1a]">
        <div className="w-1/2 p-4 border-r border-[#303030]">
          <Skeleton className="h-8 w-3/4 mb-4 bg-[#303030]" />
          <Skeleton className="h-4 w-20 mb-6 bg-[#303030]" />
          <Skeleton className="h-32 w-full mb-4 bg-[#303030]" />
        </div>
        <div className="w-1/2 flex flex-col">
          <Skeleton className="h-10 w-full bg-[#303030]" />
          <Skeleton className="flex-1 bg-[#1e1e1e]" />
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="h-[calc(100vh-56px)] bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!problem) return null;

  const availableLangs = Object.keys(problem.codeSnippets || { "C++": "" });

  return (
    <div className="h-[calc(100vh-56px)] flex bg-[#1a1a1a] text-[#eff1f6]">
      {/* LEFT PANEL */}
      <div className="w-1/2 flex flex-col border-r border-[#303030]">
        {/* Top Nav */}
        {/* <div className="flex items-center gap-1 px-3 py-2 border-b border-[#303030]">
          <button 
            onClick={() => router.push('/problem')}
            className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-[#303030] rounded"
          >
            <FileText className="w-4 h-4" />
            Problem List
          </button>
          <button className="p-1.5 hover:bg-[#303030] rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-[#303030] rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-[#303030] rounded">
            <Shuffle className="w-4 h-4" />
          </button>
        </div> */}

        {/* Tabs */}
        <div className="flex items-center border-b border-[#303030] bg-[#282828]">
          {[
            { id: "description", label: "Description", icon: FileText },
            { id: "editorial", label: "Editorial" },
            { id: "solutions", label: "Solutions" },
            { id: "submissions", label: "Submissions", icon: History },
          ].map((tab, idx) => (
            <React.Fragment key={tab.id}>
              {idx > 0 && <span className="text-[#3e3e3e]">|</span>}
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm transition ${
                  activeTab === tab.id
                    ? "text-white bg-[#1a1a1a] border-b-2 border-white"
                    : "text-[#eff1f6bf] hover:text-white"
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "description" && (
            <div className="p-5">
              <h1 className="text-xl font-medium mb-3">{problem.title}</h1>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-sm font-medium ${getDifficultyClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {["Topics", "Companies", "Hint"].map((btn) => (
                  <button key={btn} className="px-2.5 py-1 text-xs rounded-full bg-[#303030] hover:bg-[#404040]">
                    {btn}
                  </button>
                ))}
              </div>

              <div className="text-sm leading-relaxed text-[#eff1f6bf] space-y-4">
                <p>{problem.description}</p>

                {problem.examples?.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {problem.examples.map((ex, idx) => (
                      <div key={idx}>
                        <p className="font-medium text-white mb-2">Example {idx + 1}:</p>
                        <div className="bg-[#282828] rounded-lg p-3 font-mono text-sm space-y-1">
                          <div><span className="font-semibold text-white">Input:</span> {ex.input}</div>
                          <div><span className="font-semibold text-white">Output:</span> {ex.output}</div>
                          {ex.explanation && <div><span className="font-semibold text-white">Explanation:</span> {ex.explanation}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints && (
                  <div className="mt-6">
                    <p className="font-medium text-white mb-2">Constraints:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {Array.isArray(problem.constraints) 
                        ? problem.constraints.map((c, i) => <li key={i}>{c}</li>)
                        : <li>{problem.constraints}</li>
                      }
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "editorial" && (
            <div className="p-5 text-sm text-[#eff1f6bf]">Editorial coming soon...</div>
          )}

          {activeTab === "solutions" && (
            <div className="p-5 text-sm text-[#eff1f6bf]">Solutions coming soon...</div>
          )}

          {activeTab === "submissions" && (
            <div className="p-5">
              {problemSubmission?.length > 0 ? (
                <div className="space-y-2">
                  {problemSubmission.map((sub, idx) => (
                    <div key={idx} className="p-3 bg-[#282828] rounded-lg text-sm">
                      <div className={sub.status === "Accepted" ? "text-[#00b8a3]" : "text-[#ff375f]"}>
                        {sub.status}
                      </div>
                      <div className="text-xs text-[#eff1f6bf] mt-1">{sub.language}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#eff1f6bf]">No submissions yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#303030] bg-[#282828]">
          <div className="flex items-center gap-1 text-sm">
            <Code2 className="w-4 h-4" />
            Code
          </div>
        </div>

        {/* Language & Actions */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#303030]">
          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-[#303030] text-sm px-3 py-1.5 rounded cursor-pointer hover:bg-[#404040]"
            >
              {availableLangs.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <span className="text-xs text-[#eff1f6bf] flex items-center gap-1">
              <span className="w-2 h-2 bg-[#00b8a3] rounded-full"></span>
              Auto
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={runStatus === "loading"}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded hover:bg-[#303030] disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitStatus === "loading"}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded bg-[#00b8a3] hover:bg-[#00a392] text-white font-medium disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={getMonacoLanguage(lang)}
            value={sourceCode}
            onChange={(value) => setSourceCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              folding: true,
              renderLineHighlight: "line",
            }}
          />
        </div>

        {/* Console */}
        <div className={`border-t border-[#303030] ${consoleOpen ? 'h-48' : 'h-10'}`}>
          <div className="flex items-center justify-between px-3 border-b border-[#303030] bg-[#282828]">
            <div className="flex items-center">
              <button
                onClick={() => setConsoleTab("testcase")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm ${consoleTab === "testcase" ? "text-white" : "text-[#eff1f6bf]"}`}
              >
                <Check className="w-4 h-4" />
                Testcase
              </button>
              <button
                onClick={() => setConsoleTab("result")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm ${consoleTab === "result" ? "text-white" : "text-[#eff1f6bf]"}`}
              >
                ›_ Test Result
              </button>
            </div>
            <button onClick={() => setConsoleOpen(!consoleOpen)} className="p-1 hover:bg-[#303030] rounded">
              {consoleOpen ? "▼" : "▲"}
            </button>
          </div>

          {consoleOpen && (
            <div className="p-3 overflow-y-auto h-[calc(100%-36px)]">
              {consoleTab === "testcase" && (
                <div className="space-y-3">
                  {problem.testcases?.filter(tc => !tc.isHidden).map((tc, idx) => (
                    <div key={idx}>
                      <div className="text-xs text-[#eff1f6bf] mb-1">Case {idx + 1}</div>
                      <div className="bg-[#282828] rounded p-2 font-mono text-sm">{tc.input}</div>
                    </div>
                  )) || <div className="text-sm text-[#eff1f6bf]">No test cases</div>}
                </div>
              )}

              {consoleTab === "result" && (
                <div>
                  {runStatus === "loading" && (
                    <div className="flex items-center gap-2 text-sm text-[#eff1f6bf]">
                      <div className="w-4 h-4 border-2 border-[#00b8a3] border-t-transparent rounded-full animate-spin"></div>
                      Running...
                    </div>
                  )}
                  {runResult && (
                    <div className="space-y-2">
                      <div className={runResult.status === "Accepted" ? "text-[#00b8a3]" : "text-[#ff375f]"}>
                        {runResult.status || "Completed"}
                      </div>
                      {runResult.output && (
                        <div className="bg-[#282828] rounded p-2 font-mono text-sm">{runResult.output}</div>
                      )}
                    </div>
                  )}
                  {submitResult && (
                    <div className="space-y-2">
                      <div className={submitResult.status === "Accepted" ? "text-[#00b8a3]" : "text-[#ff375f]"}>
                        {submitResult.status}
                      </div>
                    </div>
                  )}
                  {!runResult && !submitResult && runStatus !== "loading" && (
                    <div className="text-sm text-[#eff1f6bf]">Run your code first</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
