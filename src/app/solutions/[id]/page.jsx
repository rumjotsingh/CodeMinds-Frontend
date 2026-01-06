"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubmissionById } from "../../../redux/slices/submissionSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function SolutionPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { single: submission, loading } = useSelector(
    (state) => state.submissions
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSubmissionById(id));
    }
  }, [id, dispatch]);

  if (loading || !submission) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] p-6">
        <Skeleton className="h-[80vh] w-full rounded-xl bg-[#303030]" />
      </div>
    );
  }

  const {
    verdict,
    isCorrect,
    languageId,
    sourceCode,
    passedTestCases,
    totalTestCases,
    testResults,
  } = submission;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6] p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold tracking-tight">Submission Result</h1>

      {/* Verdict Summary */}
      <Card className="border border-[#303030] bg-[#282828]">
        <CardContent className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <Badge
              variant={isCorrect ? "default" : "destructive"}
              className="text-lg px-4 py-1"
            >
              {verdict}
            </Badge>
            <p className="text-[#eff1f6bf]">
              Your solution was {isCorrect ? "accepted 🎉" : "rejected ❌"}.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Badge variant="outline" className="text-base px-3">
              {passedTestCases} / {totalTestCases} Passed
            </Badge>
            
          </div>
        </CardContent>
      </Card>

      {/* Submitted Code */}
      <Card className="border border-[#303030] bg-[#282828]">
        <CardHeader className="flex flex-row items-center gap-2">
          <Code2 className="h-5 w-5 text-[#eff1f6bf]" />
          <CardTitle>Submitted Code</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] border border-[#303030] rounded-xl">
            <SyntaxHighlighter
              language="cpp"
              style={vscDarkPlus}
              wrapLongLines
              customStyle={{ borderRadius: "0.5rem", margin: 0 }}
            >
              {sourceCode}
            </SyntaxHighlighter>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
        <div className="grid gap-4">
          {testResults?.map((test, index) => (
            <Card
              key={test._id}
              className="p-4 border border-[#303030] bg-[#282828] shadow-sm hover:bg-[#303030]/30 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
                <div>
                  <p className="text-xs uppercase text-[#eff1f6bf] mb-1">
                    Input
                  </p>
                  <p className="font-mono text-sm p-2 bg-[#1a1a1a] rounded border border-[#303030]">
                    {test.input}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-[#eff1f6bf] mb-1">
                    Expected
                  </p>
                  <p className="font-mono text-sm p-2 bg-[#1a1a1a] rounded border border-[#303030]">
                    {test.expectedOutput}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-[#eff1f6bf] mb-1">
                    Output
                  </p>
                  <p className="font-mono text-sm p-2 bg-[#1a1a1a] rounded border border-[#303030]">
                    {test.actualOutput}
                  </p>
                </div>
                <div className="flex items-center">
                  {test.passed ? (
                    <Badge
                      className="flex items-center gap-1 text-base px-3 bg-[#00b8a3] text-white"
                    >
                      <CheckCircle className="h-4 w-4" /> Passed
                    </Badge>
                  ) : (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1 text-base px-3"
                    >
                      <XCircle className="h-4 w-4" /> Failed
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
