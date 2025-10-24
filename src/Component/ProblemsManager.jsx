"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../redux/slices/problemSlice";
import ProblemForm from "./ProbelmsForm";

// shadcn/ui imports
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function ProblemsManager() {
  const dispatch = useDispatch();
  const { items = [], status } = useSelector((state) => state.problem || {});

  const [openForm, setOpenForm] = useState(false);
  const [editProblem, setEditProblem] = useState(null);

  const [toDeleteId, setToDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchProblems());
  }, [dispatch]);

  function onCreateClick() {
    setEditProblem(null);
    setOpenForm(true);
  }
  function onEditClick(problem) {
    setEditProblem(problem);
    setOpenForm(true);
  }
  function onDeleteClick(id) {
    setToDeleteId(id);
    
  }
  function onCloseForm() {
    setOpenForm(false);
    setEditProblem(null);
  }
  function handleConfirmDelete() {
    dispatch(deleteProblem(toDeleteId));
    setToDeleteId(null);
  }

  return (
    <div className="space-y-8 w-full">
      {/* Enhanced Header Section - Responsive & Theme */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border w-full">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Problems Management</h2>
          <p className="text-muted-foreground">Create, edit, and manage coding problems for your platform</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-muted px-3 py-1 rounded-lg border border-border">
              <span className="text-sm font-semibold text-foreground">{items.length} Total Problems</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-lg border border-green-200 dark:border-green-800">
              <span className="text-sm font-semibold text-green-800 dark:text-green-200">Active</span>
            </div>
          </div>
        </div>
        <Button
          variant="default"
          onClick={onCreateClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-6 py-3 text-base font-semibold border border-border"
        >
           Create New Problem
        </Button>
      </div>

      <ProblemsTable items={items} onEdit={onEditClick} onDelete={onDeleteClick} />

      {openForm && (
        <ProblemForm initialValues={editProblem} onClose={onCloseForm} />
      )}

      {/* Confirm Delete Dialog - Theme & Responsive */}
      <Dialog open={!!toDeleteId} onOpenChange={() => setToDeleteId(null)}>
        <DialogPortal>
          <DialogContent className="sm:max-w-lg border border-border shadow-xl bg-card">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl md:text-2xl font-bold text-destructive flex items-center gap-3">
                <span className="text-destructive">⚠️</span>
                Delete Problem
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base leading-relaxed">
                Are you sure you want to permanently delete this problem? This action cannot be undone and will remove all associated data.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setToDeleteId(null)}
                className="border border-border text-foreground hover:bg-muted px-6"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 shadow-sm"
              >
                 Delete Forever
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}

function ProblemsTable({ items, onEdit, onDelete }) {
  if (!items.length)
    return (
      <div className="text-center py-12 md:py-16 bg-muted rounded-xl border border-border">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No problems created yet</h3>
          <p className="text-muted-foreground mb-6">Start building your problem collection by creating your first coding challenge.</p>
        </div>
      </div>
    );

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
    <div className="overflow-x-auto">
      <Table className="w-full min-w-[600px]">
        <TableHeader>
          <TableRow className="border-b border-border bg-muted">
            <TableHead className="font-bold text-foreground px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">Problem Title</TableHead>
            <TableHead className="font-bold text-foreground px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">Difficulty</TableHead>
            <TableHead className="font-bold text-foreground px-4 md:px-6 py-3 md:py-4 text-sm md:text-base">Tags</TableHead>
            <TableHead className="font-bold text-foreground px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((pb, index) => (
            <TableRow
              key={pb._id || pb.id}
              className="hover:bg-muted/60 border-b border-border last:border-b-0 transition-colors"
            >
              <TableCell className="font-semibold text-foreground px-4 md:px-6 py-4 md:py-5 text-sm md:text-base">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-xs md:text-sm font-bold border border-border">
                    {index + 1}
                  </span>
                  <span className="line-clamp-1">{pb.title.length > 40 ? pb.title.slice(0, 40) + "..." : pb.title}</span>
                </div>
              </TableCell>
              <TableCell className="px-4 md:px-6 py-4 md:py-5">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs md:text-sm font-semibold border ${getDifficultyStyle(pb.difficulty)}`}>
                  {pb.difficulty}
                </span>
              </TableCell>
              <TableCell className="px-4 md:px-6 py-4 md:py-5">
                <div className="flex flex-wrap gap-2">
                  {(pb.tags || []).slice(0, 1).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-medium px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                  {(pb.tags || []).length > 1 && (
                    <span className="inline-flex items-center bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-lg border border-border">
                      +{(pb.tags || []).length - 1}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-4 md:px-6 py-4 md:py-5">
                <div className="flex justify-center gap-2 md:gap-3">
                  <Button
                    size="sm"
                    
                    onClick={() => onEdit(pb)}
                    className=""
                  >
                     Update
                  </Button>
                  <Button
                    size="sm"
                 
                    onClick={() => onDelete(pb._id)}
                    className="border border-[#e3e3e3]"
                  >
                     Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
