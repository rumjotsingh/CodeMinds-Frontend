import { useDispatch, useSelector } from "react-redux";
import { fetchComments, postComment } from "../redux/slices/commentsSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CommentSection({ problemId }) {
  const dispatch = useDispatch();
  const { comments, loading, error } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth); // assuming you have user auth state

  const [newComment, setNewComment] = useState("");

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
      toast("Created new Comment")
      dispatch(fetchComments(problemId)); // re-fetch after successful post
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className=" max-w-2xl mx-auto ">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>

      {/* Loading & error state */}
  

      {/* Comment list */}
      

      {/* Add new comment */}
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border rounded resize-none focus:outline-none focus:ring focus:border-blue-300"
          rows="3"
          placeholder="Write a comment..."
        />
        <button
          onClick={handlePost}
          disabled={!newComment.trim() || loading}
          className="mt-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </div>
  );
}
