import { useDispatch, useSelector } from "react-redux";
import { fetchComments, postComment } from "../redux/slices/commentsSlice";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function CommentSection({ problemId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { comments, loading, error } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  const [newComment, setNewComment] = useState("");

  const charCount = useMemo(() => newComment.trim().length, [newComment]);
  const canPost = !!user && charCount > 0 && !loading;

  useEffect(() => {
    if (problemId) {
      dispatch(fetchComments(problemId));
    }
  }, [problemId, dispatch]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    try {
      await dispatch(postComment({ problemId, content: newComment })).unwrap();
      setNewComment("");
      toast("Comment posted");
      dispatch(fetchComments(problemId));
    } catch (err) {
      toast("Failed to post comment");
      console.error("Failed to post comment:", err);
    }
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && canPost) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <Card className="bg-card border border-border shadow-sm text-foreground rounded-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">Discussion</h3>
          {typeof comments?.length === "number" && (
            <span className="text-xs sm:text-sm text-muted-foreground">{comments.length} comments</span>
          )}
        </div>

        {error && (
          <div className="text-xs sm:text-sm text-destructive border border-destructive/30 bg-destructive/10 rounded px-3 py-2">
            {String(error)}
          </div>
        )}

       

        <div className="space-y-2">
          <Label htmlFor="new-comment" className="text-xs sm:text-sm text-muted-foreground">
            Add a comment
          </Label>
          <Textarea
            id="new-comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={onKeyDown}
            className="bg-input text-foreground border border-border min-h-[96px]"
            placeholder={user ? "Write a comment... (Ctrl/Cmd + Enter to post)" : "Sign in to write a comment"}
            disabled={!user || loading}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{charCount}/1000</span>
            <div className="flex gap-2">
              {!user && (
                <Button variant="outline" size="sm" onClick={() => router.push("/login")}>Sign in</Button>
              )}
              <Button size="sm" onClick={handlePost} disabled={!canPost}>
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
