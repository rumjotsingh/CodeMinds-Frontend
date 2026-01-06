"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar"
  

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
const ContestManager = () => {
  // Dialog state for create contest button
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [startDate, setStartDate] = useState("" );
  const [endDate, setEndDate] = useState("" );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  const dispatch = useDispatch();
    useEffect(() => {
  async function fetchData() {
    try {
      await Promise.all([dispatch(fetchContests()), dispatch(fetchProblems())]);
    } catch (error) {
      console.error("Failed to fetch contests or problems:", error);
    }
  }

  fetchData();
}, [dispatch]); 

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

  // Dialog control state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogSelection, setDialogSelection] = useState(new Set());


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
  setStartDate(undefined);
  setStartTime("");
  setEndDate(undefined);
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
    // startDate and endDate are Date objects
    const startDateTime = new Date(startDate);
    startDateTime.setHours(Number(startTime.split(":")[0] || 0));
    startDateTime.setMinutes(Number(startTime.split(":")[1] || 0));
    const endDateTime = new Date(endDate);
    endDateTime.setHours(Number(endTime.split(":")[0] || 0));
    endDateTime.setMinutes(Number(endTime.split(":")[1] || 0));
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
      {/* Normal Create Contest Button */}
      <div className="w-full flex justify-end mb-4">
        <Button
          className="bg-primary text-primary-foreground shadow-lg px-6 py-3 rounded-xl text-base font-semibold"
          onClick={() => setOpenCreateDialog(true)}
        >
          🏆 Create Contest
        </Button>
      </div>

      {/* Create Contest Dialog with shadcn/ui Calendar */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogPortal>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto border border-border  bg-card">
            <DialogHeader className="pb-4 border-b border-border">
              <DialogTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                Create New Contest
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                Set up a new coding competition for your platform
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                setOpenCreateDialog(false);
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold text-foreground">Contest Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Weekly Contest #1"
                  className="border border-border focus:border-primary h-12 text-base bg-muted text-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold text-foreground">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your coding contest and its objectives..."
                  className="border border-border focus:border-primary min-h-[100px] text-base bg-muted text-foreground"
                  required
                />
              </div>
              {/* Date and Time Selection using shadcn/ui Calendar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date & Time */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-foreground">Start Date & Time</Label>
                  <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                        type="button"
                      >
                        {startDate ? startDate.toLocaleDateString() : "Select Start Date"}
                        <span className="ml-2"><svg width="16" height="16" fill="none" stroke="currentColor"><path d="M4 6l4 4 4-4"/></svg></span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setStartDate(date);
                          setStartCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-border focus:border-primary h-11 bg-muted text-foreground"
                    required
                  />
                </div>
                {/* End Date & Time */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-foreground">End Date & Time</Label>
                  <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                        type="button"
                      >
                        {endDate ? endDate.toLocaleDateString() : "Select End Date"}
                        <span className="ml-2"><svg width="16" height="16" fill="none" stroke="currentColor"><path d="M4 6l4 4 4-4"/></svg></span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setEndDate(date);
                          setEndCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-border focus:border-primary h-11 bg-muted text-foreground"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setOpenCreateDialog(false)} className="w-full md:w-auto">Cancel</Button>
                <Button type="submit" className="w-full md:w-auto">Create Contest</Button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
                  

      {/* All Contests Section - Theme & Mobile */}
      <section className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-8">
        <div className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-foreground">All Contests</h2>
              <p className="text-muted-foreground mt-1">Manage and view all created contests</p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <span className="inline-block animate-spin h-6 w-6 border-b-2 border-primary" />
              <span className="text-muted-foreground">Loading contests...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-destructive/10 rounded-lg border border-destructive/30">
            <span className="text-4xl mb-2 block">⚠️</span>
            <p className="text-destructive font-medium">{error}</p>
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-12 md:py-16 bg-muted rounded-xl border border-border border-dashed">
            <span className="text-6xl mb-4 block">🏆</span>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No contests created yet</h3>
            <p className="text-muted-foreground mb-6">Create your first coding contest to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {contests.map((contest, index) => (
              <div
                key={contest._id}
                className="bg-muted rounded-xl border border-border p-4 md:p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-base md:text-xl font-bold text-foreground">{contest.title}</h3>
                      <p className="text-muted-foreground mt-1">{contest.description}</p>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-lg border border-green-200 dark:border-green-800 text-sm font-semibold">
                    Active
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🚀</span>
                      <span className="text-sm font-semibold text-foreground">Start Time</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(contest.startTime).toLocaleString()}</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🏁</span>
                      <span className="text-sm font-semibold text-foreground">End Time</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(contest.endTime).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm">💻</span>
                    <span className="text-sm font-semibold text-foreground">Problems ({contest.problems?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(contest.problems)
                      ? <>
                          {contest.problems.slice(0, 5).map((prb, idx) => (
                            <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-medium px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                              {prb.title || prb}
                            </span>
                          ))}
                          {contest.problems.length > 5 && (
                            <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-lg border border-border">
                              +{contest.problems.length - 5} more
                            </span>
                          )}
                        </>
                      : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dialog for Problems Selection - Theme & Mobile */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogPortal>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto border border-border shadow-xl bg-card">
            <DialogHeader className="pb-4 border-b border-border">
              <DialogTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
                <span className="text-2xl">📝</span>
                Select Contest Problems
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                Choose problems for your contest. Selected problems will be available to participants.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              {problemsStatus === "loading" && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <span className="inline-block animate-spin h-5 w-5 border-b-2 border-primary" />
                    <span className="text-muted-foreground">Loading problems...</span>
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
                          return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
                        case "MEDIUM":
                          return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
                        case "HARD":
                          return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
                        default:
                          return "bg-muted text-muted-foreground border-border";
                      }
                    };
                    return (
                      <label
                        className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-muted shadow-sm'
                            : 'border-border hover:border-muted-foreground hover:bg-muted/60'
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
                          className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground text-base">{p.title}</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${getDifficultyStyle(p.difficulty)}`}>
                              {p.difficulty}
                            </span>
                          </div>
                          {p.tags && p.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {p.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
                                  {tag}
                                </span>
                              ))}
                              {p.tags.length > 3 && (
                                <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded border border-border">
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

            <DialogFooter className="flex flex-col md:flex-row justify-between items-center pt-4 border-t border-border gap-2 md:gap-0">
              <div className="text-sm text-muted-foreground">
                {dialogSelection.size} problem{dialogSelection.size !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2 md:gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="border border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDialogSelection}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
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
