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
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Create New Contest</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Weekly Contest #1"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="First coding contest"
              required
            />
          </div>

          {/* Problems Selection */}
          <div>
            <Label>Selected Problems</Label>
            {selectedProblems.size === 0 && (
              <p className="text-sm text-gray-500 mb-2">No problems selected yet.</p>
            )}
            {selectedProblems.size > 0 && (
              <ul className="mb-2 max-h-36 overflow-auto border rounded p-3 space-y-1 bg-gray-50">
                {Array.from(selectedProblems).map((id) => {
                  const problem = problems.find((p) => p._id === id);
                  return (
                    <li key={id} className="text-sm">
                      {problem?.title || id}
                    </li>
                  );
                })}
              </ul>
            )}
            <Button type="button" onClick={openAddProblemsDialog}>
              Add / Edit Problems
            </Button>
          </div>

          {/* Start Date and Time */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                type="time"
                id="start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* End Date and Time */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                type="time"
                id="end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Contest"}
          </Button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">All Contests</h2>
        {loading ? (
          <p>Loading contests...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : contests.length === 0 ? (
          <p>No contests found</p>
        ) : (
          <ul className="space-y-4">
            {contests.map((contest) => (
              <li
                key={contest._id}
                className="border rounded p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">{contest.title}</h3>
                <p>{contest.description}</p>
                <p className="text-sm text-gray-500">
                  Start: {new Date(contest.startTime).toLocaleString()} | End:{" "}
                  {new Date(contest.endTime).toLocaleString()}
                </p>
                <p>
                  Problems:{" "}
                  {contest.problems
                    ?.map((prb) => prb.title || prb) 
                    .join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Dialog for Problems Selection */}
     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogPortal>
    <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Select Problems</DialogTitle>
        <DialogDescription>
          Select one or more problems to add to the contest.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2 mt-4">
        {problemsStatus === "loading" && <p>Loading problems...</p>}
        {problemsStatus === "succeeded" &&
          problems?.map((p) => (
            <label
              className="flex items-center space-x-2"
              htmlFor={`problem-${p._id}`}
              key={p._id}
            >
              <input
                type="checkbox"
                id={`problem-${p._id}`}
                checked={dialogSelection.has(p._id)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const newSet = new Set(dialogSelection);
                  if (checked) newSet.add(p._id);
                  else newSet.delete(p._id);
                  setDialogSelection(newSet);
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{p.title}</span>
            </label>
          ))}
      </div>

      <DialogFooter className="flex justify-end space-x-3 mt-6">
        <Button variant="outline" onClick={() => setOpenDialog(false)}>
          Cancel
        </Button>
        <Button onClick={confirmDialogSelection}>Add Selected</Button>
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>

    </div>
  );
};

export default ContestManager;
