"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubmissionById } from "../../redux/slices/submissionSlice";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function SolutionPage() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("submissionId");
  const dispatch = useDispatch();

  const { single: submission, loading } = useSelector(
    (state) => state.submissions
  );

  useEffect(() => {
    if (submissionId) {
      // @ts-ignore
      dispatch(fetchSubmissionById(submissionId));
    }
  }, [submissionId]);

  if (loading || !submission) {
    return <Skeleton className="h-[80vh] w-full rounded-xl" />;
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
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Submission Result</h1>

      <Card className="border">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-4 items-center">
            <Badge variant={isCorrect ? "default" : "destructive"}>
              {verdict}
            </Badge>
            <Badge>{passedTestCases} / {totalTestCases} Test Cases Passed</Badge>
            <Badge>Language ID: {languageId}</Badge>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-2">Submitted Code</h2>
        <ScrollArea className="h-[400px] border rounded-xl p-3">
          <SyntaxHighlighter
            language="cpp"
            style={vscDarkPlus}
            wrapLongLines
            customStyle={{ borderRadius: "0.5rem" }}
          >
            {sourceCode}
          </SyntaxHighlighter>
        </ScrollArea>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Test Results</h2>
        <div className="grid gap-4">
          {testResults?.map((test, index) => (
            <Card key={test._id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Input</p>
                  <p className="font-mono">{test.input}</p>
                </div>
                <Separator orientation="vertical" className="hidden md:block h-12" />
                <div>
                  <p className="text-sm text-muted-foreground">Expected</p>
                  <p className="font-mono">{test.expectedOutput}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Output</p>
                  <p className="font-mono">{test.actualOutput}</p>
                </div>
                <div className="flex items-center gap-1">
                  {test.passed ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Passed
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
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
