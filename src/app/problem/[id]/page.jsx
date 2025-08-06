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
import { useParams } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import CodeEditor from "../../../Component/CodeEditer";
import { Skeleton } from "@/components/ui/skeleton";
import CommentSection from "../../../Component/Commnets";

function markdownToHtml(md) {
  return md
    ?.replace(/``````/g, '<pre class="bg-muted p-2 rounded"><code>$1</code></pre>')
    .replace(/\n/g, "<br/>");
}

function copyToClipboard(value) {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(value);
    toast("Copied to clipboard");
  }
}

function getMonacoLanguage(lang) {
  switch (lang.toUpperCase()) {
    case "PYTHON":
      return "python";
    case "C++":
    case "CPP":
      return "cpp";
    default:
      return "plaintext";
  }
}

function getLanguageId(lang) {
  switch (lang.toUpperCase()) {
    case "PYTHON":
      return 71;
    case "CPP":
    case "C++":
      return 54;
    default:
      return 0;
  }
}

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    getById: problem,
    status,
    error,
    runStatus,
    runResult,
    runError,
    submitStatus,
    submitResult,
    submitError,
  } = useSelector((state) => state.problem);

    const { comments, loading } = useSelector((state) => state.comments);
  const availableLangs = ["C++", "PYTHON"];
  const [leftTab, setLeftTab] = useState("problem");
  const [rightTab, setRightTab] = useState("problem");
  const [lang, setLang] = useState(() => {
    if (!problem) return "C++";
    const codes = Object.keys(problem?.codeSnippets || {}).map((l) =>
      l.toUpperCase()
    );
    const firstAvailableLang = availableLangs.find((l) => codes.includes(l));
    return firstAvailableLang || "C++";
  });

  const [sourceCode, setSourceCode] = useState("");
  useEffect(() => {
    // Lock scroll when this page is mounted
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore scroll when user navigates away
      document.body.style.overflow = 'auto';
    };
  }, []);


  useEffect(() => {
    if (problem?.codeSnippets) {
      const codes = Object.keys(problem?.codeSnippets).map((l) =>
        l.toUpperCase()
      );
      const firstAvailableLang = availableLangs?.find((l) => codes.includes(l));
      if (firstAvailableLang && firstAvailableLang !== lang) {
        setLang(firstAvailableLang);
      }
      setSourceCode(problem?.codeSnippets[firstAvailableLang] || "");
    }
  }, [problem]);
  useEffect(() => {
    if (id) {
      dispatch(fetchComments(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!problem) return;
    const code = problem?.codeSnippets?.[lang] || "";
    setSourceCode(code);
  }, [lang, problem]);

  useEffect(() => {
    if (id) dispatch(fetchProblemsById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (submitStatus === "succeeded") {
      toast(
        `Submission successful! Passed ${submitResult?.passedTestcases} / ${submitResult?.totalTestcases}`
      );
    }
  }, [submitStatus, submitResult]);

  if (status === "loading") {
    return (
      <div className="flex w-full h-[calc(100vh-64px)] min-h-[600px] gap-8 p-8 bg-muted/60">
        <div className="w-[40%] min-w-[325px] flex flex-col gap-4">
          <Skeleton className="h-10 w-[70%] mb-2" />
          <Skeleton className="h-6 w-[90px] mb-2 rounded-xl" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-[60px] rounded"/>
            <Skeleton className="h-6 w-[60px] rounded"/>
            <Skeleton className="h-6 w-[60px] rounded"/>
          </div>
          <Skeleton className="h-24 w-full mt-3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-28 w-full"/>
        </div>
        <div className="w-[60%] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg"/>
          <Skeleton className="h-24 w-full mt-4"/>
        </div>
      </div>
    );
  }

  if (status === "failed")
    return (
      <div className="p-8 text-destructive text-lg flex items-center h-full justify-center">
        {error}
      </div>
    );
  if (!problem) return null;

  const visibleCases = (problem?.testcases || []).filter((tc) => !tc.isHidden);

  function handleRun() {
    if (!sourceCode.trim()) {
      toast("Please write code before running.");
      return;
    }
    dispatch(clearRunResult());
    dispatch(
      runCode({
        problemId: id,
        languageId: getLanguageId(lang),
        sourceCode,
      })
    );
  }

  function handleSubmit() {
    if (!sourceCode.trim()) {
      toast("Please write code before submitting.");
      return;
    }
    dispatch(clearSubmitResult());
    dispatch(
      submitCode({
        problemId: id,
        languageId: getLanguageId(lang),
        sourceCode,
      })
    );
  }
 
  function onCodeChange(newCode) {
    setSourceCode(newCode);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex w-full h-[calc(100vh-64px)] min-h-[600px] ">
        {/* LEFT SIDE */}
         <Tabs
            value={rightTab}
            onValueChange={setRightTab}
            className="flex-1 flex flex-col "
          >
         <TabsList className="w-full text-md">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="solutions">Solutions</TabsTrigger>
          </TabsList>
           
           
            <TabsContent value="problem" className="flex-1 overflow-hidden">
  <aside
    className="w-full min-w-[325px] mb-10 px-8 py-6   overflow-y-auto flex flex-col gap-4 h-[calc(100vh-5rem)]"
  >
    <div>
      <h1 className="text-3xl font-extrabold mb-2 text-primary">
        {problem?.title}
      </h1>
      <Badge
        variant={
          problem?.difficulty === "EASY"
            ? "success"
            : problem?.difficulty === "MEDIUM"
            ? "warning"
            : "destructive"
        }
        className="font-semibold tracking-wide text-sm"
      >
        {problem?.difficulty || ""}
      </Badge>
    </div>

    <div className="mb-4 flex gap-2 flex-wrap">
      {problem?.tags?.map((tag) => (
        <Badge variant="secondary" key={tag} className="text-xs">
          {tag}
        </Badge>
      ))}
    </div>

    <section
      className="prose prose-sm max-w-none"
      style={{ fontFamily:"inter" ,fontSize: 16 }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: markdownToHtml(problem?.description),
        }}
      />
    </section>

   <div className="mb-20">
        <h2 className="font-semibold ">Constraints</h2>
        <ul className="list-disc list-inside text-sm">
          {problem?.constraints?.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        </div>
    
  </aside>
            </TabsContent>
            

        <TabsContent
  value="comments"
  className="flex-grow overflow-auto px-4 py-4  max-h-[600px]" // Adjust height as needed
>
  <CommentSection problemId={id} />
  <div className="space-y-4 mb-6 mt-6">
        {comments?.length > 0 ? (
          comments.map((c,ind) => (
            <div key={c._id ||ind } className="border border-[#e3e3e3] p-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-blue-700">
                  {c?.userId?.name || "Unknown User"}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800">{c.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
</TabsContent>

            <TabsContent value="solutions" className="flex flex-col h-full">
              <Section title="Reference Solutions">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {availableLangs.map((l) => (
                    <Button
                      key={l}
                      size="sm"
                      variant={lang === l ? "default" : "outline"}
                      className="rounded px-4"
                      onClick={() => setLang(l)}
                    >
                      {l}
                    </Button>
                  ))}
                </div>

                <Card className="shadow-sm border flex-grow overflow-auto">
                  <CardContent className="p-4 relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 opacity-80 hover:opacity-100"
                      title="Copy Solution"
                      tabIndex={-1}
                      onClick={() =>
                        copyToClipboard(problem?.referenceSolutions?.[lang] || "")
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <pre className="bg-background rounded text-sm leading-6 overflow-x-auto p-4 font-mono whitespace-pre-wrap">
                      {problem?.referenceSolutions?.[lang]}
                    </pre>
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>

         </Tabs>

        {/* RIGHT SIDE */}
        <main className="w-[60%] p-8 flex flex-col h-full overflow-auto  border border-[#e3e3e3]">
         
            {/* PROBLEM TAB */}
          
              <div className="mb-6 flex items-center gap-4">
                <label htmlFor="language-select" className="font-semibold">
                  Language:
                </label>
                <select
                  id="language-select"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 shadow-sm max-w-[130px]"
                >
                  {availableLangs.map((availableLang) => (
                    <option key={availableLang} value={availableLang}>
                      {availableLang}
                    </option>
                  ))}
                </select>

                <div className="flex-grow" />

                <Button
                  variant="outline"
                  onClick={handleRun}
                  disabled={runStatus === "loading" || submitStatus === "loading"}
                >
                  {runStatus === "loading" ? (
                    <span className="animate-spin inline-block mr-2 w-4 h-4 border-2 border-t-2 border-gray-600 rounded-full"></span>
                  ) : (
                    "Run"
                  )}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitStatus === "loading" || runStatus === "loading"}
                >
                  {submitStatus === "loading" ? (
                    <span className="animate-spin inline-block mr-2 w-4 h-4 border-2 border-t-2 border-white rounded-full"></span>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>

             
                  <CodeEditor
                    key={lang}
                    language={getMonacoLanguage(lang)}
                    value={sourceCode}
                    onChange={onCodeChange}
                  />
               
               <Section title="Examples" className="mt-6">
                {visibleCases?.length === 0 && (
                  <div className="text-muted-foreground">No public test cases.</div>
                )}
                <div className="space-y-3 mt-2 max-h-[320px] overflow-y-auto pr-2">
                  {visibleCases?.map((t, idx) => (
                    <Card
                      key={t._id || idx}
                      className="!shadow-xs group relative border"
                    >
                      <CardContent className="py-2 pr-8 pl-4">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 z-10"
                          title="Copy Input & Output"
                          tabIndex={-1}
                          onClick={() =>
                            copyToClipboard(`Input:\n${t.input}\nOutput:\n${t.output}`)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <div className="pb-1.5">
                          <span className="font-bold">Input</span>:{" "}
                          <code className="font-mono">{t.input.replace(/\n/g, "  ")}</code>
                        </div>
                        <div>
                          <span className="font-bold">Output</span>:{" "}
                          <code className="font-mono">{t.output}</code>
                        </div>
                        {t.explanation && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            <span className="font-bold">Explanation</span>: {t.explanation}
                          </div>
                        )}
                        <Badge
                          variant={t.passed ? "success" : "destructive"}
                          className="absolute bottom-2 right-4 text-xs px-2 py-0.5"
                        >
                          {t.passed ? "Passed" : "Failed"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>

              {/* Display Run Results */}
              {runResult && (
                <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded">
                  <p className="font-medium mb-2">
                    Passed {runResult.passedTestcases} of {runResult.totalTestcases} visible testcases.
                  </p>
                  <ul className="max-h-32 overflow-auto list-decimal ml-5 text-sm space-y-1">
                    {runResult.testResults.map((test, idx) => (
                      <li
                        key={idx}
                        className={test.passed ? "text-green-700" : "text-red-600"}
                      >
                        Input: {test.input}, Expected: {test.expectedOutput}, Actual:{" "}
                        {test.actualOutput} — {test.passed ? "Passed" : "Failed"} (Time:{" "}
                        {test.time}s, Memory: {test.memory}KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Display Submit Results */}
              {submitResult && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded">
                  <p className="font-medium mb-2">
                    Submit finished. Passed {submitResult.passedTestcases} of {submitResult.totalTestcases} total testcases.
                  </p>
                  <ul className="max-h-48 overflow-auto list-decimal ml-5 text-sm space-y-1">
                    {submitResult.testResults.map((test, idx) => (
                      <li
                        key={idx}
                        className={test.passed ? "text-green-700" : "text-red-600"}
                      >
                        Input: {test.input}, Expected: {test.expectedOutput}, Actual:{" "}
                        {test.actualOutput} — {test.passed ? "Passed" : "Failed"} (Time:{" "}
                        {test.time}s, Memory: {test.memory}KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(runError || submitError) && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
                  {runError || submitError}
                </div>
              )}
            

          
            
        
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-4">
      <h2 className="font-semibold text-base mb-1 text-primary">{title}</h2>
      {children}
    </section>
  );
}
