import { useDispatch, useSelector } from "react-redux";
import { fetchComments, postComment } from "../redux/slices/commentsSlice";
import { useEffect, useState } from "react";

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
      dispatch(fetchComments(problemId)); // re-fetch after successful post
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="mt-6 max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-2xl font-semibold mb-4">Comments</h3>

      {/* Loading & error state */}
      {loading && <p className="text-gray-600">Loading comments...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Comment list */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {comments?.length > 0 ? (
          comments.map((c,ind) => (
            <div key={c._id ||ind } className="border border-gray-200 p-4 rounded-md">
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
          disabled={!newComment.trim()}
          className="mt-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
}
