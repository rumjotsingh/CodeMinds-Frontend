"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProblems, fetchTags } from "../../redux/slices/problemSlice";
import {
  fetchAllPlaylists,
  createPlaylist,
  addProblemToPlaylist
} from "../../redux/slices/playlistSlice";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
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


export default function ProblemsList() {
  const dispatch = useDispatch();
    const { isAuthenticated, loading: authLoading } = useAuth();
const router = useRouter();
  
  const { items: problems, status, tags, error } = useSelector(
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState({
    EASY: false,
    MEDIUM: false,
    HARD: false
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

 
  const [open, setOpen] = useState(false);

  useEffect(() => {
     dispatch(fetchProblems());
     dispatch(fetchTags());
    dispatch(fetchAllPlaylists());
  }, [ dispatch]);

  // Filter and paginate problems
  const filteredAndPaginatedProblems = useMemo(() => {
    let filtered = problems || [];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Difficulty filter
    const activeDifficulties = Object.entries(difficultyFilter)
      .filter(([_, isActive]) => isActive)
      .map(([difficulty]) => difficulty);
    
    if (activeDifficulties.length > 0) {
      filtered = filtered.filter(problem => 
        activeDifficulties.includes(problem.difficulty)
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(problem =>
        selectedTags.some(tag => problem.tags?.includes(tag))
      );
    }

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProblems = filtered.slice(startIndex, endIndex);

    return {
      problems: paginatedProblems,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / itemsPerPage)
    };
  }, [problems, searchTerm, difficultyFilter, selectedTags, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, difficultyFilter, selectedTags]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setDifficultyFilter({ EASY: false, MEDIUM: false, HARD: false });
    setSelectedTags([]);
    setCurrentPage(1);
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
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto">
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden ">
        {/* Sidebar */}
        {/* <aside className="border border-[#e3e3e3] p-4 mt-10 w-64 overflow-y-auto sticky top-0" >
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="mb-6">
            <p className="font-medium mb-2">Difficulty</p>
    {["EASY", "MEDIUM", "HARD"].map((level) => (
      <label
        key={level}
        className="flex items-center space-x-2 mb-1 cursor-pointer select-none"
      >
        <Checkbox
          checked={difficultyFilter[level]}
          onCheckedChange={() => {
            setDifficultyTouched(true);
            setDifficultyFilter((prev) => ({
              ...prev,
              [level]: !prev[level],
            }));
          }}
        />
        <span>{level}</span>
      </label>
    ))}
  </div>
</aside> */}


        {/* Main Content */}
        <main className={`overflow-y-auto w-full p-4 md:p-6 transition-all duration-300 `}>
          {/* Header with Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Problems</h1>
              
              {/* Search and Filter Toggle */}
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search problems or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[#e3e3e3]"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-[#e3e3e3] hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="bg-white border border-[#e3e3e3] rounded-lg p-4 space-y-4">
                <div className="flex flex-wrap gap-6">
                  {/* Difficulty Filter */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">Difficulty</h3>
                    <div className="flex flex-wrap gap-2">
                      {["EASY", "MEDIUM", "HARD"].map((level) => (
                        <label
                          key={level}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <Checkbox
                            checked={difficultyFilter[level]}
                            onCheckedChange={() => {
                              setDifficultyFilter(prev => ({
                                ...prev,
                                [level]: !prev[level]
                              }));
                            }}
                          />
                          <span className="text-sm">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  {tags && tags.length > 0 && (
                    <div className="space-y-2 flex-1">
                      <h3 className="font-medium text-gray-900">Tags</h3>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {tags.slice(0, 20).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              selectedTags.includes(tag)
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-gray-100 text-gray-700 border-[#e3e3e3] hover:bg-gray-200"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Clear Filters */}
                <div className="pt-2 border-t border-[#e3e3e3]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredAndPaginatedProblems.problems?.length || 0} of{" "}
                {filteredAndPaginatedProblems.totalCount || 0} problems
              </span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-32 border-[#e3e3e3]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <p className="text-red-600 text-center">{error}</p>
          )}

          {/* Problems Display */}
          {status === "succeeded" && (
            <>
               
                <>
                  {/* For larger screens, keep table */}
                  <div className="hidden md:block">
                    <Table className="">
                     
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
                        {filteredAndPaginatedProblems.problems?.map((problem, index) => (
                          <TableRow key={problem._id}>
                            <TableCell className="font-medium">
                              {problem.title}
                            </TableCell>
                             <TableCell className="font-medium gap-4 flex">
                              {problem.tags.slice(0,3).map((tag)=><span key={tag} className="text-sm font-medium px-2 py-1 rounded bg-gray-100">{tag}</span>)}
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
      className="cursor-pointer border border-[#e3e3e3] hover:bg-gray-100 hover:text-gray-900 transition-all"
    >
      Add to Playlist
    </Button>
                              
                                



                             
                            </TableCell>
                            <TableCell>
                              <Button asChild size="sm">
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
    className="
      bg-white 
      
    "
  >
    <DialogHeader>
      <DialogTitle>Add to Playlist</DialogTitle>
      <DialogDescription>
        Add "{selectedProblem?.title}" to an existing playlist or create a new one.
      </DialogDescription>
    </DialogHeader>

    {!isCreateMode ? (
      <>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Playlist</Label>
            <Select
              value={selectedPlaylistId}
              onValueChange={(val) => setSelectedPlaylistId(val)}
            >
              <SelectTrigger className="w-full bg-gray-50 shadow-sm border rounded-md px-3 py-2 text-sm cursor-pointer">
                <SelectValue placeholder="Select a playlist..." />
              </SelectTrigger>
              <SelectContent>
                {playlists.map((item) => (
                  <SelectItem key={item?._id} value={item?._id}>
                    {item?.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateMode(true)}
          >
            Create New Playlist
          </Button>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleAddToPlaylist}
            disabled={playlistLoading || !selectedPlaylistId}
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
            <Label>Playlist Title</Label>
            <Input
              value={newPlaylist.title}
              onChange={(e) =>
                setNewPlaylist((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter playlist title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newPlaylist.description}
              onChange={(e) =>
                setNewPlaylist((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter playlist description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateMode(false)}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleCreatePlaylist}
            disabled={playlistLoading || !newPlaylist.title.trim()}
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
                    {filteredAndPaginatedProblems.problems?.map((problem) => (
                      <div
                        key={problem._id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
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
                          <Badge variant="outline">Unsolved</Badge>
                        </div>

                        <div className="flex space-x-2">

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex-1"
                                onClick={() => setSelectedProblem(problem)}
                              >
                                Add to Playlist
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add to Playlist</DialogTitle>
                                <DialogDescription>
                                  Add "{problem.title}" to an existing playlist or create a new one.
                                </DialogDescription>
                              </DialogHeader>

                              {!isCreateMode ? (
                                <>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label>Select Playlist</Label>
                                      <Select
                                        value={selectedPlaylistId}
                                        onValueChange={(val) => setSelectedPlaylistId(val)}
                                      >
                                        <SelectTrigger className="w-full bg-gray-50 shadow-sm border rounded-md px-3 py-2 text-sm cursor-pointer">
                                          <SelectValue placeholder="Select a playlist..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {playlists.map((playlist) => (
                                            <SelectItem key={playlist._id} value={playlist._id}>
                                              {playlist.title}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => setIsCreateMode(true)}
                                    >
                                      Create New Playlist
                                    </Button>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      type="button"
                                      onClick={handleAddToPlaylist}
                                      disabled={playlistLoading || !selectedPlaylistId}
                                    >
                                      {playlistLoading ? (
                                        <>
                                          <span className="inline-block animate-spin h-4 w-4 border-b-2 border-current mr-2" />
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
                                      <Label>Playlist Title</Label>
                                      <Input
                                        value={newPlaylist.title}
                                        onChange={(e) => setNewPlaylist(prev => ({
                                          ...prev,
                                          title: e.target.value
                                        }))}
                                        placeholder="Enter playlist title"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Description</Label>
                                      <Textarea
                                        value={newPlaylist.description}
                                        onChange={(e) => setNewPlaylist(prev => ({
                                          ...prev,
                                          description: e.target.value
                                        }))}
                                        placeholder="Enter playlist description"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => setIsCreateMode(false)}
                                    >
                                      Back
                                    </Button>
                                    <Button
                                      type="button"
                                      onClick={handleCreatePlaylist}
                                      disabled={!newPlaylist.title.trim()}
                                    >
                                      Create & Add
                                    </Button>
                                  </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button asChild size="sm" className="flex-1">
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

          {/* Pagination */}
          {status === "succeeded" && filteredAndPaginatedProblems.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-[#e3e3e3]"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(filteredAndPaginatedProblems.totalPages, 7) }, (_, i) => {
                  let pageNumber;
                  if (filteredAndPaginatedProblems.totalPages <= 7) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 4) {
                    pageNumber = i + 1;
                  } else if (currentPage >= filteredAndPaginatedProblems.totalPages - 3) {
                    pageNumber = filteredAndPaginatedProblems.totalPages - 6 + i;
                  } else {
                    pageNumber = currentPage - 3 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 p-0 ${
                        currentPage === pageNumber
                          ? "bg-black text-white"
                          : "border-[#e3e3e3] hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, filteredAndPaginatedProblems.totalPages))}
                disabled={currentPage === filteredAndPaginatedProblems.totalPages}
                className="border-[#e3e3e3]"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
