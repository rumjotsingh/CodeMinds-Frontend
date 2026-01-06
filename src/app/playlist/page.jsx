"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPlaylists,
  deletePlaylist,
  updatePlaylist,
} from "../../redux/slices/playlistSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Edit, Trash, X, ListMusic, FolderOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PlaylistPage = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [playlistToEdit, setPlaylistToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const playlists = useSelector((state) => state.playlists?.playlists || []);
  const loadingPlaylists = useSelector((state) => state.playlists?.loading || false);
  const error = useSelector((state) => state.playlists?.error);

  useEffect(() => {
    dispatch(fetchAllPlaylists());
  }, [dispatch]);

  const openDeleteDialog = (playlist) => {
    setPlaylistToDelete(playlist);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deletePlaylist(playlistToDelete._id));
    setIsDeleteOpen(false);
    setPlaylistToDelete(null);
  };

  const openEditDialog = (playlist) => {
    setPlaylistToEdit(playlist);
    setEditTitle(playlist.title);
    setEditDescription(playlist.description);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    if (!playlistToEdit) return;
    dispatch(
      updatePlaylist({
        playlistId: playlistToEdit._id,
        updateData: { title: editTitle, description: editDescription },
      })
    );
    setIsEditOpen(false);
    setPlaylistToEdit(null);
  };

  const goToPlaylistProblems = (id) => {
    router.push(`/playlist/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <ListMusic className="w-7 h-7 text-[#00b8a3]" />
              Your Playlists
            </h1>
            <p className="text-[#eff1f6bf] mt-1 text-sm">
              Organize your coding problems into collections
            </p>
          </div>
          <button
            onClick={() => router.push("/problem")}
            className="flex items-center gap-2 px-4 py-2 bg-[#00b8a3] hover:bg-[#00a392] text-white rounded-lg font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Add Problems
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-[#ff375f20] border border-[#ff375f] rounded-lg">
            <p className="text-[#ff375f] font-medium">Error loading playlists</p>
            <p className="text-sm text-[#eff1f6bf]">{error.message || "An unexpected error occurred"}</p>
          </div>
        )}

        {/* Loading */}
        {loadingPlaylists ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-[#282828] border border-[#303030] rounded-xl">
                <Skeleton className="h-6 w-48 bg-[#303030] mb-3" />
                <Skeleton className="h-4 w-full bg-[#303030] mb-2" />
                <Skeleton className="h-4 w-24 bg-[#303030]" />
              </div>
            ))}
          </div>
        ) : playlists.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#282828] flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-[#eff1f6bf]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
            <p className="text-[#eff1f6bf] mb-6 max-w-md mx-auto">
              Create your first playlist to start organizing your coding problems into collections.
            </p>
            <button
              onClick={() => router.push("/problem")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b8a3] hover:bg-[#00a392] text-white rounded-lg font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Create Your First Playlist
            </button>
          </div>
        ) : (
          /* Playlists Grid */
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="p-5 bg-[#282828] border border-[#303030] rounded-xl hover:border-[#404040] transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-[#00b8a3] transition">
                    {playlist.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-[#00b8a320] text-[#00b8a3] rounded">
                    {playlist.problemCount} problem{playlist.problemCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm text-[#eff1f6bf] mb-4 line-clamp-2">
                  {playlist.description || "No description"}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPlaylistProblems(playlist._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00b8a3] hover:bg-[#00a392] text-white text-sm font-medium rounded-lg transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openEditDialog(playlist)}
                    className="p-2 bg-[#303030] hover:bg-[#404040] rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteDialog(playlist)}
                    className="p-2 bg-[#ff375f20] hover:bg-[#ff375f30] text-[#ff375f] rounded-lg transition"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#282828] border border-[#303030] rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Delete Playlist</h2>
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="p-1 hover:bg-[#303030] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[#eff1f6bf] mb-6">
                Are you sure you want to delete{" "}
                <strong className="text-white">{playlistToDelete?.title}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="flex-1 px-4 py-2 bg-[#303030] hover:bg-[#404040] rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loadingPlaylists}
                  className="flex-1 px-4 py-2 bg-[#ff375f] hover:bg-[#e02f52] text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {loadingPlaylists ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#282828] border border-[#303030] rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Playlist</h2>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1 hover:bg-[#303030] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#303030] rounded-lg text-[#eff1f6] focus:outline-none focus:border-[#00b8a3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#303030] rounded-lg text-[#eff1f6] focus:outline-none focus:border-[#00b8a3] resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-4 py-2 bg-[#303030] hover:bg-[#404040] rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={loadingPlaylists || !editTitle.trim()}
                  className="flex-1 px-4 py-2 bg-[#00b8a3] hover:bg-[#00a392] text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {loadingPlaylists ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
