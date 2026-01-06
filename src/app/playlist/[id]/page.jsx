"use client";

import { useParams, useRouter } from "next/navigation";
import {
  getPlaylistById,
  removeProblemFromPlaylist,
} from "../../../redux/slices/playlistSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Code2, Trash2, X } from "lucide-react";

const PlaylistDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [removeModal, setRemoveModal] = useState(null);

  const { currentPlaylist, loading } = useSelector((state) => state.playlists);

  useEffect(() => {
    dispatch(getPlaylistById(id));
  }, [dispatch, id]);

  const handleRemoveProblem = async (problemId) => {
    try {
      await dispatch(
        removeProblemFromPlaylist({
          playlistId: currentPlaylist._id,
          problemId: problemId,
        })
      );
      setRemoveModal(null);
      setTimeout(() => {
        dispatch(getPlaylistById(id));
      }, 500);
    } catch (error) {
      console.error("Error removing problem:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toUpperCase()) {
      case "EASY":
        return "text-[#00b8a3] bg-[#00b8a320]";
      case "MEDIUM":
        return "text-[#ffc01e] bg-[#ffc01e20]";
      case "HARD":
        return "text-[#ff375f] bg-[#ff375f20]";
      default:
        return "text-[#eff1f6bf] bg-[#303030]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-64 bg-[#303030] mb-4" />
          <Skeleton className="h-5 w-96 bg-[#303030] mb-8" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-[#303030] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#eff1f6bf] text-lg mb-4">Playlist not found</p>
          <button
            onClick={() => router.push("/playlist")}
            className="px-4 py-2 bg-[#282828] hover:bg-[#303030] border border-[#303030] rounded-lg transition"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/playlist")}
            className="flex items-center gap-2 text-[#eff1f6bf] hover:text-[#eff1f6] mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Playlists
          </button>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{currentPlaylist?.title}</h1>
              <p className="text-[#eff1f6bf]">{currentPlaylist?.description}</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-[#282828] border border-[#303030] rounded-lg text-sm">
                <Code2 className="w-4 h-4 text-[#00b8a3]" />
                {currentPlaylist?.problems?.length || 0} Problem
                {(currentPlaylist?.problems?.length || 0) !== 1 ? "s" : ""}
              </div>
            </div>
            <button
              onClick={() => router.push("/problem")}
              className="flex items-center gap-2 px-4 py-2 bg-[#00b8a3] hover:bg-[#00a392] text-white rounded-lg font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Add Problems
            </button>
          </div>
        </div>

        {/* Problems List */}
        {!currentPlaylist?.problems?.length ? (
          <div className="text-center py-16 bg-[#282828] border border-[#303030] rounded-xl">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-semibold mb-2">No problems in this playlist yet</h3>
            <p className="text-[#eff1f6bf] mb-6 max-w-md mx-auto">
              Start building your collection by adding some coding problems to practice.
            </p>
            <button
              onClick={() => router.push("/problem")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b8a3] hover:bg-[#00a392] text-white rounded-lg font-medium transition"
            >
              Browse Problems to Add
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-[#282828] border border-[#303030] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#303030] bg-[#1a1a1a]">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#eff1f6bf]">
                      Problem Title
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#eff1f6bf]">
                      Tags
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#eff1f6bf]">
                      Difficulty
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-[#eff1f6bf]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlaylist.problems.map((problem, idx) => (
                    <tr
                      key={problem._id}
                      className={`border-b border-[#303030] last:border-b-0 hover:bg-[#303030]/50 transition ${
                        idx % 2 === 0 ? "bg-[#282828]" : "bg-[#262626]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span 
                          onClick={() => router.push(`/problem/${problem._id}`)}
                          className="font-medium hover:text-[#00b8a3] cursor-pointer transition"
                        >
                          {problem.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {problem?.tags?.slice(0, 3)?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs bg-[#303030] text-[#eff1f6bf] rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded ${getDifficultyColor(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/problem/${problem._id}`)}
                            className="px-4 py-1.5 bg-[#00b8a3] hover:bg-[#00a392] text-white text-sm font-medium rounded-lg transition"
                          >
                            Solve
                          </button>
                          <button
                            onClick={() => setRemoveModal(problem)}
                            className="p-2 bg-[#ff375f20] hover:bg-[#ff375f30] text-[#ff375f] rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {currentPlaylist.problems.map((problem) => (
                <div
                  key={problem._id}
                  className="p-4 bg-[#282828] border border-[#303030] rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium">{problem.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {problem?.tags?.slice(0, 3)?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-[#303030] text-[#eff1f6bf] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/problem/${problem._id}`)}
                      className="flex-1 py-2 bg-[#00b8a3] hover:bg-[#00a392] text-white text-sm font-medium rounded-lg transition"
                    >
                      Solve
                    </button>
                    <button
                      onClick={() => setRemoveModal(problem)}
                      className="px-4 py-2 bg-[#ff375f20] hover:bg-[#ff375f30] text-[#ff375f] text-sm font-medium rounded-lg transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Remove Modal */}
        {removeModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#282828] border border-[#303030] rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Remove Problem</h2>
                <button
                  onClick={() => setRemoveModal(null)}
                  className="p-1 hover:bg-[#303030] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[#eff1f6bf] mb-6">
                Remove <strong className="text-white">{removeModal.title}</strong> from{" "}
                <strong className="text-white">{currentPlaylist.title}</strong>? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRemoveModal(null)}
                  className="flex-1 px-4 py-2 bg-[#303030] hover:bg-[#404040] rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveProblem(removeModal._id)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#ff375f] hover:bg-[#e02f52] text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {loading ? "Removing..." : "Yes, Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
