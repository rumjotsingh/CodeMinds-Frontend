"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblems, fetchGroupedTags, fetchProblemsByTags, searchProblems } from "../../redux/slices/problemSlice";
import {
  fetchAllPlaylists,
  createPlaylist,
  addProblemToPlaylist
} from "../../redux/slices/playlistSlice";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
// Checkbox removed from UI per design request (functionality preserved where needed)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { pl } from "date-fns/locale";


export default function ProblemsList() {
  const dispatch = useDispatch();
    const { isAuthenticated, loading: authLoading } = useAuth();
const router = useRouter();
  
  const { items: problems, status, groupedTags, groupedTagsStatus, error, searchCount } = useSelector(
    (state) => state.problem
  );
  
  const { playlists = [], loading: playlistLoading = false } = useSelector(
    (state) => state.playlists || {}
  );
 

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
    description: ""
  });
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  // Difficulty filter state removed; now handled by backend
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

 
  const [open, setOpen] = useState(false);

  useEffect(() => {
     dispatch(fetchProblems());
     dispatch(fetchGroupedTags());
    dispatch(fetchAllPlaylists());
  }, [ dispatch]);
 

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search problems when debounced search term changes
  useEffect(() => {
    if (searchDebounce.trim()) {
      dispatch(searchProblems(searchDebounce));
    } else if (!selectedTags.length) {
      dispatch(fetchProblems());
    }
  }, [searchDebounce, dispatch, selectedTags.length]);

  // Problems now come directly from backend filtering
  const filteredProblems = problems || [];

  // Fetch problems by tags when selected tags change
  useEffect(() => {
    if (selectedTags.length > 0) {
      dispatch(fetchProblemsByTags(selectedTags));
    } else if (!searchDebounce.trim()) {
      dispatch(fetchProblems());
    }
  }, [selectedTags, dispatch, searchDebounce]);
 
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      const difficulties = ["EASY", "MEDIUM", "HARD"];
      let newTags;
      if (difficulties.includes(tag)) {
        // If a difficulty is selected, remove all other difficulties and add only this one
        newTags = [...prev.filter(t => !difficulties.includes(t)), tag];
      } else {
        // For non-difficulty tags, toggle as usual
        newTags = prev.includes(tag)
          ? prev.filter(t => t !== tag)
          : [...prev, tag];
      }
      const selectedDifficulties = newTags.filter(t => difficulties.includes(t));
      const selectedOtherTags = newTags.filter(t => !difficulties.includes(t));
      if (selectedOtherTags.length > 0 && selectedDifficulties.length > 0) {
        dispatch(fetchProblemsByTags([...selectedOtherTags, ...selectedDifficulties]));
      } else if (selectedOtherTags.length > 0) {
        dispatch(fetchProblemsByTags(selectedOtherTags));
      } else if (selectedDifficulties.length > 0) {
        dispatch(fetchProblemsByTags(selectedDifficulties));
      } else {
        dispatch(fetchProblems());
      }
      return newTags;
    });
  };

  const clearAllFilters = () => {
  setSearchTerm("");
  setSelectedTags([]);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylist.title.trim() || !selectedProblem) return;
    if (!authLoading && !isAuthenticated) {
      toast("You must be logged in to view Create Playlist");
      router.push("/login");
    }

    const result = await dispatch(createPlaylist(newPlaylist));
    if (result.payload?._id) {
      // Add the problem to the newly created playlist
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
    toast("You must be logged in to view Create Playlist");
    router.push("/login");
  }

    await dispatch(addProblemToPlaylist({
      playlistId: selectedPlaylistId,
      problemId: selectedProblem._id
    }));
    toast("Problem added to playlist");


    setSelectedProblem(null);
    setOpen(false);
    setSelectedPlaylistId("");
  };

 

  const getBadgeColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-200 text-green-800";
      case "MEDIUM":
        return "bg-yellow-200 text-yellow-800";
      case "HARD":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

 
   


  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto bg-background text-foreground">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sidebar Filters - Desktop */}
        {showFilters && (
          <aside className="hidden md:block w-64 border-r border-border bg-card p-4 overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-muted-foreground hover:text-primary text-xs"
                >
                  Clear All
                </Button>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground text-sm">Difficulty</h3>
                <div className="space-y-2">
                  {["EASY", "MEDIUM", "HARD"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded transition group"
                    >
                      <Checkbox
                        checked={selectedTags.includes(level)}
                        onCheckedChange={() => handleTagToggle(level)}
                        className="border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              {groupedTagsStatus === "succeeded" && (
                <>
                  {/* Companies */}
                  {groupedTags.companies?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground text-sm">Companies</h3>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {groupedTags.companies.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-2 py-1 text-xs rounded-md border transition-all ${
                              selectedTags.includes(tag)
                                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                : "bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Structures */}
                  {groupedTags.dataStructures?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground text-sm">Data Structures</h3>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {groupedTags.dataStructures.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-2 py-1 text-xs rounded-md border transition-all ${
                              selectedTags.includes(tag)
                                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                : "bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Algorithms */}
                  {groupedTags.algorithms?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground text-sm">Algorithms</h3>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {groupedTags.algorithms.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-2 py-1 text-xs rounded-md border transition-all ${
                              selectedTags.includes(tag)
                                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                : "bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topics */}
                  {groupedTags.topics?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground text-sm">Topics</h3>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {groupedTags.topics.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-2 py-1 text-xs rounded-md border transition-all ${
                              selectedTags.includes(tag)
                                ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                : "bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 transition-all duration-300 bg-background">
          {/* Header with Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">Problems</h1>
              
              {/* Search and Filter Toggle */}
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-border bg-input text-foreground"
                  />
                  {searchDebounce && searchDebounce !== searchTerm && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-border hover:bg-muted"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Mobile Filter Sidebar */}
            {showFilters && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setShowFilters(false)}
                />
                <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card border-r border-border z-50 overflow-y-auto shadow-xl md:hidden">
                  <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-muted-foreground hover:text-primary text-xs"
                      >
                        Clear All
                      </Button>
                      <Button
                        onClick={() => setShowFilters(false)}
                        variant="ghost"
                        size="sm"
                        className="text-foreground hover:bg-muted"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-6">
                    {/* Difficulty Filter */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground text-sm">Difficulty</h3>
                      <div className="space-y-2">
                        {["EASY", "MEDIUM", "HARD"].map((level) => (
                          <label
                            key={level}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded transition group"
                          >
                            <Checkbox
                              checked={selectedTags.includes(level)}
                              onCheckedChange={() => handleTagToggle(level)}
                              className="border-2 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                            />
                            <span className="text-sm text-foreground group-hover:text-primary transition-colors">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Tags Filter */}
                    {groupedTagsStatus === "succeeded" && (
                      <>
                        {/* Companies */}
                        {groupedTags.companies?.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="font-semibold text-foreground text-sm">Companies</h3>
                            <div className="flex flex-wrap gap-2">
                              {groupedTags.companies.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => handleTagToggle(tag)}
                                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                                    selectedTags.includes(tag)
                                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                      : "bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Data Structures */}
                        {groupedTags.dataStructures?.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="font-semibold text-foreground text-sm">Data Structures</h3>
                            <div className="flex flex-wrap gap-2">
                              {groupedTags.dataStructures.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => handleTagToggle(tag)}
                                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                                    selectedTags.includes(tag)
                                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                      : "bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Algorithms */}
                        {groupedTags.algorithms?.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="font-semibold text-foreground text-sm">Algorithms</h3>
                            <div className="flex flex-wrap gap-2">
                              {groupedTags.algorithms.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => handleTagToggle(tag)}
                                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                                    selectedTags.includes(tag)
                                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                      : "bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Topics */}
                        {groupedTags.topics?.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="font-semibold text-foreground text-sm">Topics</h3>
                            <div className="flex flex-wrap gap-2">
                              {groupedTags.topics.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => handleTagToggle(tag)}
                                  className={`px-2 py-1 text-xs rounded-md border transition-all ${
                                    selectedTags.includes(tag)
                                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                      : "bg-muted text-foreground border-border hover:bg-primary/10 hover:border-primary hover:text-primary"
                                  }`}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Results Summary */}
          
          </div>
          {/* Loading Skeleton */}
          {status === "loading" && (
            <div className="space-y-4">
              {[...Array(10)].map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex flex-col md:grid md:grid-cols-5 gap-4 py-2 border-b border-gray-200"
                >
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {status === "failed" && (
            <p className="text-destructive text-center">{error}</p>
          )}

          {/* Problems Display */}
          {status === "succeeded" && (
            <>
               
                <>
                  {/* For larger screens, keep table */}
                  <div className="hidden md:block">
                    <Table className="bg-card text-foreground">
                     
                      <TableHeader>
                        <TableRow>
                          <TableHead>Problem</TableHead>
                           <TableHead>Tags</TableHead>
                          <TableHead>Difficulty</TableHead>
                         
                          <TableHead>Add to Playlist</TableHead>
                          <TableHead>Solve</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProblems.map((problem, index) => (
                          <TableRow key={problem._id}>
                            <TableCell className="font-medium">
                              {problem.title.slice(0, 30) && problem.title.length > 30
                                ? problem.title.slice(0, 30) + "..."
                                : problem.title}
                            </TableCell>
                             <TableCell className="font-medium gap-4 flex">
                              {problem.tags.slice(0,3).map((tag)=><span key={tag} className="text-sm font-medium px-2 py-1 rounded bg-muted text-muted-foreground">{tag}</span>)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-sm font-medium px-2 py-1 rounded ${getBadgeColor(
                                  problem.difficulty
                                )}`}
                              >
                                {problem.difficulty}
                              </span>
                            </TableCell>
                          
                            <TableCell>
                               <Button
      variant="secondary"
      size="sm"
      onClick={() => {
        setSelectedProblem(problem);
        setOpen(true);
      }}
  className="cursor-pointer border border-border hover:bg-muted hover:text-primary transition-all"
    >
      Add to Playlist
    </Button>
                              
                                



                             
                            </TableCell>
                            <TableCell>
                              <Button asChild size="sm" className="bg-primary text-primary-foreground">
                                <a
                                  href={`/problem/${problem._id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Solve
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
   
  </DialogTrigger>

  <DialogContent
    className="bg-card text-foreground border border-border"
  >
    <DialogHeader>
      <DialogTitle className="text-primary">Add to Playlist</DialogTitle>
      <DialogDescription className="text-muted-foreground">
        Add "{selectedProblem?.title}" to an existing playlist or create a new one.
      </DialogDescription>
    </DialogHeader>

    {!isCreateMode ? (
      <>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-foreground">Select Playlist</Label>
            <Select
              value={selectedPlaylistId}
              onValueChange={(val) => setSelectedPlaylistId(val)}
            >
              <SelectTrigger className="w-full bg-input text-foreground border border-border shadow-sm rounded-md px-3 py-2 text-sm cursor-pointer">
                <SelectValue placeholder="Select a playlist..." />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border">
                {playlists?.map((item) => (
                  <SelectItem key={item?._id} value={item?._id} className="text-foreground hover:bg-muted">
                    {item?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={() => setIsCreateMode(true)}
            className="w-full border border-border text-foreground  cursor-pointer"
          >
            Create New Playlist
          </Button>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleAddToPlaylist}
            disabled={playlistLoading || !selectedPlaylistId}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {playlistLoading ? (
              <>
               
                Adding...
              </>
            ) : (
              "Add to Playlist"
            )}
          </Button>
        </DialogFooter>
      </>
    ) : (
      <>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-foreground">Playlist Title</Label>
            <Input
              value={newPlaylist.title}
              onChange={(e) =>
                setNewPlaylist((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter playlist title"
              className="bg-input text-foreground border border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Description</Label>
            <Textarea
              value={newPlaylist.description}
              onChange={(e) =>
                setNewPlaylist((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter playlist description"
              className="bg-input text-foreground border border-border"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
          
            onClick={() => setIsCreateMode(false)}
            className="border-border text-foreground "
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleCreatePlaylist}
            disabled={playlistLoading || !newPlaylist.title.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {playlistLoading ? (
              <>
               
                Creating...
              </>
            ) : (
              "Create & Add"
            )}
          </Button>
        </DialogFooter>
      </>
    )}
  </DialogContent>
</Dialog>

                  {/* Mobile & small screen view - card list */}
                  <div className="md:hidden space-y-4">
                    {filteredProblems.map((problem) => (
                      <div
                        key={problem._id}
                        className="bg-card rounded-lg p-4 shadow-sm border border-border text-foreground"
                      >
                        <h3 className="text-lg font-semibold mb-1">
                          {problem.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${getBadgeColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                          <Badge variant="outline" className={`bg-muted text-muted-foreground ${problem.solved ? "text-green-500" : "text-destructive"}`} >{problem.solved ? "Solved" : "Unsolved"}</Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
      variant="secondary"
      size="sm"
      onClick={() => {
        setSelectedProblem(problem);
        setOpen(true);
      }}
  className="cursor-pointer border border-border  flex-1 bg-primary text-primary-foreground"
    >
      Add to Playlist
    </Button>

                          
                          <Button asChild size="sm" className="flex-1 bg-primary text-primary-foreground">
                            <a
                              href={`/problem/${problem._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Solve
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              
            </>
          )}
        </main>
      </div>
    </div>
  );
}
