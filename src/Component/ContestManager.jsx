"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogPortal,
} from "@/components/ui/dialog";

import { useDispatch, useSelector } from "react-redux";
import { createContest, fetchContests } from "../redux/slices/contestSlice";
import { fetchProblems } from "@/redux/slices/problemSlice";
import { toast } from "sonner";

const ContestManager = () => {
  const dispatch = useDispatch();

  const { contests, loading, error, createSuccess } = useSelector(
    (state) => state.contest || {}
  );
  const { items: problems, status: problemsStatus } = useSelector(
    (state) => state.problem || { items: [], status: "idle" }
  );

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProblems, setSelectedProblems] = useState(new Set());
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Dialog control state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogSelection, setDialogSelection] = useState(new Set());

  useEffect(() => {
  async function fetchData() {
    try {
      await Promise.all([dispatch(fetchContests()), dispatch(fetchProblems())]);
    } catch (error) {
      console.error("Failed to fetch contests or problems:", error);
    }
  }

  fetchData();
}, [dispatch]); // Initial fetch on mount

// Additional effect to fetch data after a contest is created successfully
useEffect(() => {
  if (createSuccess) {
    async function fetchUpdatedData() {
      try {
        await Promise.all([dispatch(fetchContests()), dispatch(fetchProblems())]);
      } catch (error) {
        console.error("Failed to fetch contests or problems after creation:", error);
      }
    }
    fetchUpdatedData();
  }
}, [createSuccess, dispatch]);


  useEffect(() => {
    if (createSuccess) {
      toast.success("Contest created");

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedProblems(new Set());
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    }
  }, [createSuccess]);

  // Open Dialog and initialize dialogSelection with current selected
  function openAddProblemsDialog() {
    setDialogSelection(new Set(selectedProblems));
    setOpenDialog(true);
  }
  

  // Handler to toggle problem selection inside dialog
  function toggleDialogProblem(id) {
    const newSelection = new Set(dialogSelection);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setDialogSelection(newSelection);
  }

  // Confirm dialog selection and update main selection
  function confirmDialogSelection() {
    setSelectedProblems(new Set(dialogSelection));
    setOpenDialog(false);
  }

  const validateForm = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      selectedProblems.size === 0 ||
      !startDate ||
      !startTime ||
      !endDate ||
      !endTime
    ) {
      toast("Validation error: fill all fields and select at least one problem.");
      return false;
    }
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    if (startDateTime >= endDateTime) {
      toast("End time must be after start time");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    dispatch(
      createContest({
        title,
        description,
        problems: Array.from(selectedProblems), // problem ids as array
        startTime: new Date(`${startDate}T${startTime}`).toISOString(),
        endTime: new Date(`${endDate}T${endTime}`).toISOString(),
      })
    );
  };

  return (
    <div className="space-y-8 w-full">
      {/* Enhanced Create Contest Section */}
      <section className="bg-white rounded-xl border border-[#e3e3e3] shadow-sm p-8 w-full">
        <div className="mb-8 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center border border-purple-200">
              <span className="text-xl">🏆</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black">Create New Contest</h2>
              <p className="text-gray-600 mt-1">Set up a new coding competition for your platform</p>
            </div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-8"
        >
          {/* Enhanced Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold text-black">Contest Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Weekly Contest #1"
                className="border border-[#e3e3e3] focus:border-black h-12 text-base"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base font-semibold text-black">Selected Problems</Label>
              <div className="h-12 flex items-center">
                <span className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-[#e3e3e3]">
                  {selectedProblems.size} problem{selectedProblems.size !== 1 ? 's' : ''} selected
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-black">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your coding contest and its objectives..."
              className="border border-[#e3e3e3] focus:border-black min-h-[100px] text-base"
              required
            />
          </div>

          {/* Enhanced Problems Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-black">Contest Problems</Label>
              <Button 
                type="button" 
                onClick={openAddProblemsDialog}
                variant="outline"
                className="border border-[#e3e3e3] text-black hover:bg-gray-50"
              >
                📝 Manage Problems
              </Button>
            </div>
            {selectedProblems.size === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-[#e3e3e3] border-dashed">
                <span className="text-4xl mb-2 block">📋</span>
                <p className="text-gray-600 font-medium">No problems selected yet</p>
                <p className="text-sm text-gray-500 mt-1">Click "Manage Problems" to add problems to your contest</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-[#e3e3e3] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-black">Selected Problems ({selectedProblems.size})</span>
                </div>
                <div className="grid gap-2 max-h-40 overflow-auto">
                  {Array.from(selectedProblems).map((id) => {
                    const problem = problems.find((p) => p._id === id);
                    return (
                      <div key={id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#e3e3e3]">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm font-medium text-black flex-1">{problem?.title || id}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{problem?.difficulty}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Date and Time Selection */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Start DateTime */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <Label className="text-base font-semibold text-black">Contest Start</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start-date" className="text-sm text-gray-600">Date</Label>
                    <Input
                      type="date"
                      id="start-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border border-[#e3e3e3] focus:border-black h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-time" className="text-sm text-gray-600">Time</Label>
                    <Input
                      type="time"
                      id="start-time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border border-[#e3e3e3] focus:border-black h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* End DateTime */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏁</span>
                  <Label className="text-base font-semibold text-black">Contest End</Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="end-date" className="text-sm text-gray-600">Date</Label>
                    <Input
                      type="date"
                      id="end-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border border-[#e3e3e3] focus:border-black h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time" className="text-sm text-gray-600">Time</Label>
                    <Input
                      type="time"
                      id="end-time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border border-[#e3e3e3] focus:border-black h-11"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e3e3e3]">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-black text-white hover:bg-gray-800 h-12 px-8 text-base font-semibold shadow-sm border border-[#e3e3e3]"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin h-4 w-4 border-b-2 border-current mr-2" />
                  Creating Contest...
                </>
              ) : (
                "🏆 Create Contest"
              )}
            </Button>
          </div>
        </form>
      </section>

      {/* Enhanced All Contests Section */}
      <section className="bg-white rounded-xl border border-[#e3e3e3] shadow-sm p-8">
        <div className="mb-8 pb-6 border-b border-[#e3e3e3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border border-blue-200">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-black">All Contests</h2>
              <p className="text-gray-600 mt-1">Manage and view all created contests</p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <span className="inline-block animate-spin h-6 w-6 border-b-2 border-black" />
              <span className="text-gray-600">Loading contests...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <span className="text-4xl mb-2 block">⚠️</span>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-[#e3e3e3] border-dashed">
            <span className="text-6xl mb-4 block">🏆</span>
            <h3 className="text-xl font-semibold text-black mb-2">No contests created yet</h3>
            <p className="text-gray-600 mb-6">Create your first coding contest to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {contests.map((contest, index) => (
              <div
                key={contest._id}
                className="bg-gray-50 rounded-xl border border-[#e3e3e3] p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black">{contest.title}</h3>
                      <p className="text-gray-600 mt-1">{contest.description}</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg border border-green-200 text-sm font-semibold">
                    Active
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-[#e3e3e3]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🚀</span>
                      <span className="text-sm font-semibold text-black">Start Time</span>
                    </div>
                    <p className="text-sm text-gray-600">{new Date(contest.startTime).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-[#e3e3e3]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🏁</span>
                      <span className="text-sm font-semibold text-black">End Time</span>
                    </div>
                    <p className="text-sm text-gray-600">{new Date(contest.endTime).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-[#e3e3e3]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">💻</span>
                    <span className="text-sm font-semibold text-black">Problems ({contest.problems?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contest.problems?.slice(0, 5)?.map((prb, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-lg border border-blue-200">
                        {prb.title || prb}
                      </span>
                    ))}
                    {(contest.problems?.length || 0) > 5 && (
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-lg border border-gray-200">
                        +{(contest.problems?.length || 0) - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enhanced Dialog for Problems Selection */}
     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogPortal>
    <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto border border-[#e3e3e3] shadow-xl">
      <DialogHeader className="pb-4 border-b border-[#e3e3e3]">
        <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
          <span className="text-2xl">📝</span>
          Select Contest Problems
        </DialogTitle>
        <DialogDescription className="text-gray-600 text-base">
          Choose problems for your contest. Selected problems will be available to participants.
        </DialogDescription>
      </DialogHeader>

      <div className="py-6">
        {problemsStatus === "loading" && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <span className="inline-block animate-spin h-5 w-5 border-b-2 border-black" />
              <span className="text-gray-600">Loading problems...</span>
            </div>
          </div>
        )}
        {problemsStatus === "succeeded" && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {problems?.map((p) => {
              const isSelected = dialogSelection.has(p._id);
              const getDifficultyStyle = (difficulty) => {
                switch (difficulty?.toUpperCase()) {
                  case "EASY":
                    return "bg-green-100 text-green-800 border-green-200";
                  case "MEDIUM":
                    return "bg-yellow-100 text-yellow-800 border-yellow-200";
                  case "HARD":
                    return "bg-red-100 text-red-800 border-red-200";
                  default:
                    return "bg-gray-100 text-gray-800 border-gray-200";
                }
              };
              
              return (
                <label
                  className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-black bg-gray-50 shadow-sm' 
                      : 'border-[#e3e3e3] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  htmlFor={`problem-${p._id}`}
                  key={p._id}
                >
                  <input
                    type="checkbox"
                    id={`problem-${p._id}`}
                    checked={isSelected}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const newSet = new Set(dialogSelection);
                      if (checked) newSet.add(p._id);
                      else newSet.delete(p._id);
                      setDialogSelection(newSet);
                    }}
                    className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-black text-base">{p.title}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${getDifficultyStyle(p.difficulty)}`}>
                        {p.difficulty}
                      </span>
                    </div>
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
                            {tag}
                          </span>
                        ))}
                        {p.tags.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
                            +{p.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <DialogFooter className="flex justify-between items-center pt-4 border-t border-[#e3e3e3]">
        <div className="text-sm text-gray-600">
          {dialogSelection.size} problem{dialogSelection.size !== 1 ? 's' : ''} selected
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setOpenDialog(false)}
            className="border border-[#e3e3e3] text-black hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDialogSelection}
            className="bg-black text-white hover:bg-gray-800 shadow-sm"
          >
            ✅ Add Selected ({dialogSelection.size})
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>

    </div>
  );
};

export default ContestManager;
