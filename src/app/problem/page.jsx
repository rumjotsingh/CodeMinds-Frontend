"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblems, fetchGroupedTags, fetchProblemsByTags, searchProblems } from "../../redux/slices/problemSlice";
import {
  fetchAllPlaylists,
  createPlaylist,
  addProblemToPlaylist
} from "../../redux/slices/playlistSlice";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";


export default function ProblemsList() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const { items: problems, status, groupedTags, groupedTagsStatus } = useSelector(
    (state) => state.problem
  );
  
  const { playlists = [], loading: playlistLoading = false } = useSelector(
    (state) => state.playlists || {}
  );

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ title: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProblems());
    dispatch(fetchGroupedTags());
    dispatch(fetchAllPlaylists());
  }, [dispatch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (searchDebounce.trim()) {
      dispatch(searchProblems(searchDebounce));
    } else if (!selectedTags.length) {
      dispatch(fetchProblems());
    }
  }, [searchDebounce, dispatch, selectedTags.length]);

  useEffect(() => {
    if (selectedTags.length > 0) {
      dispatch(fetchProblemsByTags(selectedTags));
    } else if (!searchDebounce.trim()) {
      dispatch(fetchProblems());
    }
  }, [selectedTags, dispatch, searchDebounce]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.title.trim() || !selectedProblem) return;
    if (!authLoading && !isAuthenticated) {
      toast.error("You must be logged in");
      router.push("/login");
      return;
    }

    const result = await dispatch(createPlaylist(newPlaylist));
    if (result.payload?._id) {
      await dispatch(addProblemToPlaylist({
        playlistId: result.payload._id,
        problemId: selectedProblem._id
      }));
    }
    setOpen(false);
    setNewPlaylist({ title: "", description: "" });
    setIsCreateMode(false);
    setSelectedProblem(null);
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId || !selectedProblem) return;
    if (!authLoading && !isAuthenticated) {
      toast.error("You must be logged in");
      router.push("/login");
      return;
    }

    await dispatch(addProblemToPlaylist({
      playlistId: selectedPlaylistId,
      problemId: selectedProblem._id
    }));
    toast.success("Problem added to playlist");
    setSelectedProblem(null);
    setOpen(false);
    setSelectedPlaylistId("");
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "EASY": return "text-[#00b8a3]";
      case "MEDIUM": return "text-[#ffc01e]";
      case "HARD": return "text-[#ff375f]";
      default: return "text-[#00b8a3]";
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-medium mb-2">Problems</h1>
          <p className="text-sm text-[#eff1f6bf]">
            Practice coding problems to improve your skills
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#eff1f6bf]" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#282828] border border-[#303030] rounded text-sm placeholder-[#eff1f6bf] focus:outline-none focus:border-[#505050]"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            {["EASY", "MEDIUM", "HARD"].map((level) => (
              <button
                key={level}
                onClick={() => handleTagToggle(level)}
                className={`px-3 py-1.5 text-xs rounded transition ${
                  selectedTags.includes(level)
                    ? level === "EASY" ? "bg-[#00b8a3]/20 text-[#00b8a3] border border-[#00b8a3]"
                    : level === "MEDIUM" ? "bg-[#ffc01e]/20 text-[#ffc01e] border border-[#ffc01e]"
                    : "bg-[#ff375f]/20 text-[#ff375f] border border-[#ff375f]"
                    : "bg-[#303030] text-[#eff1f6bf] hover:bg-[#404040]"
                }`}
              >
                {level}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 text-xs text-[#eff1f6bf] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-[#282828] rounded-lg border border-[#303030]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#303030] text-xs font-medium text-[#eff1f6bf]">
            <div className="col-span-1">Status</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Acceptance</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2">Actions</div>
          </div>

          {/* Loading State */}
          {status === "loading" && (
            <div className="p-4 space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-[#303030]" />
              ))}
            </div>
          )}

          {/* Problems List */}
          {status === "succeeded" && problems && problems.length > 0 && (
            <div className="divide-y divide-[#303030]">
              {problems.map((problem, idx) => (
                <div
                  key={problem._id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-[#303030]/50 transition"
                >
                  {/* Status */}
                  <div className="col-span-1">
                    {problem.solved ? (
                      <Check className="w-4 h-4 text-[#00b8a3]" />
                    ) : problem.attempted ? (
                      <X className="w-4 h-4 text-[#ffc01e]" />
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                  </div>

                  {/* Title */}
                  <div className="col-span-5">
                    <Link
                      href={`/problem/${problem._id}`}
                      className="text-sm hover:text-[#3b82f6] transition"
                    >
                      {idx + 1}. {problem.title}
                    </Link>
                  </div>

                  {/* Acceptance */}
                  <div className="col-span-2 text-sm text-[#eff1f6bf]">
                    {problem.acceptance || "N/A"}
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-2">
                    <span className={`text-sm font-medium ${getDifficultyClass(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <button
                      onClick={() => {
                        setSelectedProblem(problem);
                        setOpen(true);
                      }}
                      className="text-xs px-2 py-1 rounded bg-[#303030] hover:bg-[#404040] transition"
                    >
                      + List
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {status === "succeeded" && (!problems || problems.length === 0) && (
            <div className="p-12 text-center text-[#eff1f6bf]">
              No problems found
            </div>
          )}
        </div>
      </div>

      {/* Add to Playlist Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#282828] border-[#303030] text-[#eff1f6]">
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
            <DialogDescription className="text-[#eff1f6bf]">
              Add "{selectedProblem?.title}" to a playlist
            </DialogDescription>
          </DialogHeader>

          {!isCreateMode ? (
            <>
              <div className="space-y-4 py-4">
                <Select value={selectedPlaylistId} onValueChange={setSelectedPlaylistId}>
                  <SelectTrigger className="bg-[#303030] border-[#404040]">
                    <SelectValue placeholder="Select a playlist" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#282828] border-[#303030]">
                    {playlists.map((playlist) => (
                      <SelectItem key={playlist._id} value={playlist._id}>
                        {playlist.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <button
                  onClick={() => setIsCreateMode(true)}
                  className="text-sm text-[#3b82f6] hover:underline"
                >
                  + Create new playlist
                </button>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleAddToPlaylist}
                  disabled={playlistLoading || !selectedPlaylistId}
                  className="bg-[#00b8a3] hover:bg-[#00a392]"
                >
                  {playlistLoading ? "Adding..." : "Add"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Playlist title"
                  value={newPlaylist.title}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, title: e.target.value })}
                  className="bg-[#303030] border-[#404040]"
                />
                <Input
                  placeholder="Description (optional)"
                  value={newPlaylist.description}
                  onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                  className="bg-[#303030] border-[#404040]"
                />
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsCreateMode(false)}>
                  Back
                </Button>
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={playlistLoading || !newPlaylist.title.trim()}
                  className="bg-[#00b8a3] hover:bg-[#00a392]"
                >
                  {playlistLoading ? "Creating..." : "Create & Add"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
