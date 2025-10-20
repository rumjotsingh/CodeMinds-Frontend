'use client';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProblemsById,
  runCode,
  submitCode,
  clearRunResult,
  clearSubmitResult,
  fetchAllSubmission,
} from "../../../redux/slices/problemSlice";
import { fetchComments } from "../../../redux/slices/commentsSlice";
import { useParams, useRouter } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import CommentSection from "../../../Component/Commnets";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/context/authContext';
import Editor from "@monaco-editor/react";
import { fetchSubmissionsByProblemById } from './../../../redux/slices/submissionSlice';

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

function getDefaultLanguage(problem, availableLangs) {
  if (!problem) return "C++";
  const codes = Object.keys(problem?.codeSnippets || {}).map((l) =>
    l.toUpperCase()
  );
  const firstAvailableLang = availableLangs.find((l) => codes.includes(l));
  return firstAvailableLang || "C++";
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
    submitResultId,
    submitResulStatus,
    submitError,
  } = useSelector((state) => state.problem);
  const { problemSubmission } = useSelector((state) => state.submissions);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { comments, loading } = useSelector((state) => state.comments);
  const availableLangs = ["C++", "PYTHON"];
  const [tabs, setTabs] = useState("testcases");
  const [selectedCode, setSelectedCode] = useState("");
  const [rightTab, setRightTab] = useState("problem");
  const [lang, setLang] = useState(() => getDefaultLanguage(problem, availableLangs));
  const [sourceCode, setSourceCode] = useState("");
  const [hasRunProblem, setHasRunProblem] = useState(false);
  const [solutionLang, setSolutionLang] = useState(() => getDefaultLanguage(problem, availableLangs));

  useEffect(() => {
    if (id) {
      dispatch(fetchProblemsById(id));
      dispatch(fetchComments(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(fetchSubmissionsByProblemById(id));
  }, [dispatch]);

  useEffect(() => {
    if (!problem) return;
    if (problem.codeSnippets) {
      const codes = Object.keys(problem.codeSnippets).map((l) => l.toUpperCase());
      const firstAvailableLang = availableLangs?.find((l) => codes.includes(l));
      if (firstAvailableLang && firstAvailableLang !== lang) {
        setLang(firstAvailableLang);
      }
      const selectedLang = firstAvailableLang || lang;
      const code = problem.codeSnippets[selectedLang] || "";
    }
  }, [problem, lang, availableLangs]);

  useEffect(() => {
    if (lang && problem?.codeSnippets) {
      const code = problem.codeSnippets[lang] || "";
      setSourceCode(code);
    }
  }, [lang, problem]);

  useEffect(() => {
    if (runResult) {
      setRightTab("Results");
      setHasRunProblem(true);
    }
    if (runError) {
      toast(`${runError}`);
    }
  }, [runResult, runError]);

  useEffect(() => {
    if (submitStatus === "succeeded") {
      toast(`Submission successful! Passed`);
    }
  }, [submitStatus]);

  if (status === "loading") {
    return (
      <div className="flex flex-col md:flex-row w-full h-[calc(100vh-64px)] min-h-[400px] gap-4 p-4 md:p-8 bg-muted/60">
        <div className="w-full md:w-[40%] min-w-[300px] flex flex-col gap-4">
          <Skeleton className="h-8 w-[70%] mb-2" />
          <Skeleton className="h-6 w-[90px] mb-2 rounded-xl" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-[60px] rounded" />
            <Skeleton className="h-6 w-[60px] rounded" />
            <Skeleton className="h-6 w-[60px] rounded" />
          </div>
          <Skeleton className="h-20 w-full mt-3" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="w-full md:w-[60%] flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <Skeleton className="h-20 w-full mt-4" />
        </div>
      </div>
    );
  }

  if (status === "failed")
    return (
      <div className="p-4 md:p-8 text-destructive text-base md:text-lg flex items-center h-full justify-center bg-card rounded-xl shadow-sm border border-border">
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
    if (!authLoading && !isAuthenticated) {
      toast("You must be logged in to Solve problems");
      router.push("/login");
    }
    dispatch(clearRunResult());
    dispatch(
      runCode({
        problemId: id,
        languageId: getLanguageId(lang),
        sourceCode,
      })
    );
    setTabs("Results");
  }

  function handleSubmit() {
    if (!sourceCode.trim()) {
      toast("Please write code before submitting.");
      return;
    }
    if (!authLoading && !isAuthenticated) {
      toast("You must be logged in to view problems");
      router.push("/login");
    }
    dispatch(clearSubmitResult());
    dispatch(
      submitCode({
        problemId: id,
        languageId: getLanguageId(lang),
        sourceCode,
      })
    );
    toast("The Code is Submitted");
    setRightTab("result");
  }

  function onCodeChange(newCode) {
    setSourceCode(newCode);
  }

  return (
    <div className="max-w-full mx-auto px-0 sm:px-0 md:px-0 w-full bg-background text-foreground ">
      <div className="w-full h-auto min-h-[400px] gap-0 flex flex-col md:flex-row md:items-stretch md:justify-between">
        {/* LEFT SIDE */}
        <Tabs
          value={rightTab}
          onValueChange={setRightTab}
          className="w-full md:w-[40%] flex flex-col bg-card border border-border mb-4 md:mb-0 overflow-auto"
        >
          <TabsList className="w-full text-xs sm:text-sm flex-wrap justify-start sticky top-0 z-10 bg-card border-b border-border">
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="solutions">Solutions</TabsTrigger>
            <TabsTrigger value="submission">Submissions</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>

          <TabsContent value="problem" className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8 max-h-[83vh]">
            <aside className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-primary leading-tight tracking-tight">
                    {problem?.title}
                  </h1>
                  {problem?.solved && (
                    <Badge className="bg-green-500 text-white font-semibold text-xs sm:text-sm px-2 py-1">Solved</Badge>
                  )}
                  <Badge
                    variant={
                      problem?.difficulty === "EASY"
                        ? "success"
                        : problem?.difficulty === "MEDIUM"
                        ? "warning"
                        : "destructive"
                    }
                    className="font-semibold tracking-wide text-xs sm:text-sm bg-muted text-muted-foreground px-2 py-1"
                  >
                    {problem?.difficulty || ""}
                  </Badge>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {problem?.tags?.map((tag) => (
                    <Badge variant="secondary" key={tag} className="text-xs border border-border bg-muted text-muted-foreground px-2 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <section className="prose prose-sm max-w-none text-foreground" style={{ fontFamily: "inter", fontSize: 15 }}>
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(problem?.description) }} />
              </section>

              <div className="mb-2">
                <h2 className="font-bold text-base text-primary mb-1 uppercase tracking-wide">Constraints</h2>
                <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground pl-4">
                  {problem?.constraints?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </aside>
          </TabsContent>

          <TabsContent value="comments" className="flex-grow overflow-auto px-4 py-4 max-h-[83vh]">
            <CommentSection problemId={id} />
            <div className="space-y-3 mb-6 mt-4">
              {comments?.length > 0 ? (
                comments.map((c, ind) => (
                  <Card key={c._id || ind} className="border border-border bg-card shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs sm:text-sm font-semibold text-foreground">
                          {c?.userId?.name || "Unknown User"}
                        </p>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground">{c.content}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-xs sm:text-sm">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="solutions" className="flex flex-col h-full overflow-auto p-2 max-h-[83vh]">
            {hasRunProblem && (
              <Section title="Reference Solutions">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {availableLangs.map((l) => (
                    <Button
                      key={l}
                      size="sm"
                      variant={solutionLang === l ? "default" : "outline"}
                      className="px-3 text-xs sm:text-sm"
                      onClick={() => setSolutionLang(l)}
                    >
                      {l}
                    </Button>
                  ))}
                </div>

                <Card className="flex-grow overflow-auto">
                  <CardContent className="p-3 relative">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                      title="Copy Solution"
                      tabIndex={-1}
                      onClick={() =>
                        copyToClipboard(
                          problem?.referenceSolutions?.[solutionLang]
                            ?.replace(/int\s+main\s*\([^)]*\)\s*\{[\s\S]*?\n\}/, "")
                            ?.trim() || ""
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <pre className="text-xs sm:text-sm leading-5 overflow-x-auto p-3 font-mono whitespace-pre-wrap">
                      {problem?.referenceSolutions?.[solutionLang]
                        ?.replace(/int\s+main\s*\([^)]*\)\s*\{[\s\S]*?\n\}/, "")
                        ?.trim()}
                    </pre>
                  </CardContent>
                </Card>
              </Section>
            )}
          </TabsContent>

          <TabsContent value="result" className="flex flex-col h-full overflow-auto p-2 max-h-[83vh]">
            {submitResult ? (
              <Section title="Submission Result" className="mb-4">
                <Card className="mb-3 border border-border bg-card">
                  <CardContent className="p-3 text-xs sm:text-sm flex items-center gap-2">
                    <Badge
                      variant={submitResult.isCorrect ? "success" : "destructive"}
                      className="px-2 py-0.5"
                    >
                      {submitResult.isCorrect ? "Accepted" : "Failed"}
                    </Badge>
                    <span className="text-muted-foreground">
                      Passed {submitResult.passedTestCases} of {submitResult.totalTestCases} testcases
                    </span>
                  </CardContent>
                </Card>

                <div className="grid gap-3 sm:grid-cols-2">
                  {submitResult.testResults.map((test, idx) => (
                    <Card key={idx} className="border border-border bg-card">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-xs sm:text-sm">Test Case #{idx + 1}</h4>
                          <Badge variant={test.passed ? "success" : "destructive"} className="px-2 py-0.5 text-[10px] sm:text-xs">
                            {test.passed ? "Passed" : "Failed"}
                          </Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="font-semibold">Input:</span>{" "}
                            <code className="font-mono whitespace-pre-wrap">{test.input}</code>
                          </div>
                          <div>
                            <span className="font-semibold">Expected:</span>{" "}
                            <code className="font-mono whitespace-pre-wrap">{test.expectedOutput}</code>
                          </div>
                          <div>
                            <span className="font-semibold">Actual:</span>{" "}
                            <code className="font-mono whitespace-pre-wrap">{test.actualOutput}</code>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            ⏱ Time: {test.time}s &nbsp;&nbsp; 📦 Memory: {test.memory}KB
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>
            ) : (
              <div className="text-muted-foreground text-xs sm:text-sm">No submission data available.</div>
            )}
          </TabsContent>

          <TabsContent value="submission" className="flex flex-col h-full overflow-auto p-2 max-h-[83vh]">
            <Card className="overflow-auto p-3">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-muted text-muted-foreground">
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Passed / Total</th>
                    <th className="p-2 border">Correct</th>
                    <th className="p-2 border">Verdict</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problemSubmission?.map((submission, index) => (
                    <tr key={submission._id} className="border-t">
                      <td className="p-2 text-center">{index + 1}</td>
                      <td className="p-2 text-center">
                        ✅ {submission?.passedTestCases} / {submission?.totalTestCases}
                      </td>
                      <td className="p-2 text-center">{submission?.isCorrect ? "✅ Yes" : "❌ No"}</td>
                      <td className="p-2 text-center">{submission?.verdict}</td>
                      <td className="p-2 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                             
                              size="sm"
                              onClick={() =>
                                setSelectedCode(
                                  submission?.sourceCode?.replace(/int\s+main\s*\([^)]*\)\s*\{[\s\S]*?\n\}/, '')?.trim() || ""
                                )
                              }
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] sm:max-w-3xl">
                            <DialogTitle>Solution</DialogTitle>
                            <pre className="text-xs sm:text-sm overflow-auto max-h-[400px] whitespace-pre-wrap p-2">
                              {selectedCode}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* RIGHT SIDE */}
  <main className="w-full md:w-[60%] p-2 sm:p-3 flex flex-col h-full overflow-auto border border-border  shadow-sm text-foreground">
          <div className="mb-4 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRun}
              disabled={runStatus === "loading" || submitStatus === "loading"}
              size="sm"
              className="px-3 text-xs sm:text-sm"
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
              size="sm"
              className="px-3 text-xs sm:text-sm"
            >
              {submitStatus === "loading" ? (
                <span className="animate-spin inline-block mr-2 w-4 h-4 border-2 border-t-2 border-white rounded-full"></span>
              ) : (
                "Submit"
              )}
            </Button>
          </div>

          <div className="w-full mb-1">
            <Editor
              height="360px"
              language={getMonacoLanguage(lang)}
              value={sourceCode}
              theme="vs-dark"
              onChange={onCodeChange}
              options={{
                fontSize: 12,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>

          <Tabs value={tabs} onValueChange={setTabs} defaultValue="testcases" className="mt-[1px]">
            <TabsList className="text-xs sm:text-sm">
              <TabsTrigger value="testcases">Testcases</TabsTrigger>
              <TabsTrigger value="Results">Test Results</TabsTrigger>
            </TabsList>

            <TabsContent value="testcases">
              {visibleCases?.length === 0 ? (
                <div className="text-muted-foreground text-xs sm:text-sm">No public test cases.</div>
              ) : (
                <div className="flex overflow-x-auto gap-3 max-h-[300px] py-2">
                  {visibleCases?.map((t, idx) => (

                    <Card key={t._id || idx} className="min-w-[150px] sm:min-w-[150px] group relative border">
                      <CardContent className="p-1">
                        <div className="text-xs sm:text-sm">
                          <span className="font-bold">Input:</span>{" "}
                          <code className="font-mono whitespace-pre-wrap">{t.input}</code>
                        </div>
                        <div className="text-xs sm:text-sm">
                          <span className="font-bold">Output:</span>{" "}
                          <code className="font-mono">{t.output}</code>
                        </div>
                        {t.explanation && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            <span className="font-bold">Explanation:</span> {t.explanation}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="Results">
              {runResult ? (
                <div className="mb-4 space-y-3">
                  <Card className="border border-border bg-card">
                    <CardContent className="p-3 text-xs sm:text-sm text-muted-foreground">
                      Passed {runResult.passedTestcases} of {runResult.totalTestcases} visible testcases
                    </CardContent>
                  </Card>

                  <div className="grid gap-3 sm:grid-cols-2 max-h-[300px] pr-2 overflow-auto">
                    {runResult.testResults.map((test, idx) => (
                      <Card key={idx} className="border border-border bg-card">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-xs sm:text-sm">Test Case #{idx + 1}</h4>
                            <Badge variant={test.passed ? "success" : "destructive"} className="px-2 py-0.5 text-[10px] sm:text-xs">
                              {test.passed ? "Passed" : "Failed"}
                            </Badge>
                          </div>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="font-semibold">Input:</span>{" "}
                              <code className="font-mono whitespace-pre-wrap">{test.input}</code>
                            </div>
                            <div>
                              <span className="font-semibold">Expected:</span>{" "}
                              <code className="font-mono whitespace-pre-wrap">{test.expectedOutput}</code>
                            </div>
                            <div>
                              <span className="font-semibold">Actual:</span>{" "}
                              <code className="font-mono whitespace-pre-wrap">{test.actualOutput}</code>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              ⏱ Time: {test.time}s &nbsp;&nbsp; 📦 Memory: {test.memory}KB
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-xs sm:text-sm p-2">No test results available.</div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-4">
      {children}
    </section>
  );
}