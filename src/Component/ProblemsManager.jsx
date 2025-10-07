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
    toast("The Problem is Deleted ")
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
      {/* Enhanced Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#e3e3e3] w-full">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2">Problems Management</h2>
          <p className="text-gray-600">Create, edit, and manage coding problems for your platform</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="bg-gray-50 px-3 py-1 rounded-lg border border-[#e3e3e3]">
              <span className="text-sm font-semibold text-black">{items.length} Total Problems</span>
            </div>
            <div className="bg-green-50 px-3 py-1 rounded-lg border border-green-200">
              <span className="text-sm font-semibold text-green-800">Active</span>
            </div>
          </div>
        </div>
        <Button 
          variant="default" 
          onClick={onCreateClick}
          className="bg-black text-white hover:bg-gray-800 shadow-lg px-6 py-3 text-base font-semibold border border-[#e3e3e3]"
        >
          ✨ Create New Problem
        </Button>
      </div>

      <ProblemsTable items={items} onEdit={onEditClick} onDelete={onDeleteClick} />

      {openForm && (
        <ProblemForm initialValues={editProblem} onClose={onCloseForm} />
      )}

      {/* Enhanced Confirm Delete Dialog */}
      <Dialog open={!!toDeleteId} onOpenChange={() => setToDeleteId(null)}>
        <DialogPortal>
          <DialogContent className="sm:max-w-lg border border-[#e3e3e3] shadow-xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
                <span className="text-red-500">⚠️</span>
                Delete Problem
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                Are you sure you want to permanently delete this problem? This action cannot be undone and will remove all associated data.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-[#e3e3e3]">
              <Button 
                variant="outline" 
                onClick={() => setToDeleteId(null)}
                className="border border-[#e3e3e3] text-black hover:bg-gray-50 px-6"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 px-6 shadow-sm"
              >
                🗑️ Delete Forever
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
      <div className="text-center py-16 bg-gray-50 rounded-xl border border-[#e3e3e3]">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-black mb-2">No problems created yet</h3>
          <p className="text-gray-600 mb-6">Start building your problem collection by creating your first coding challenge.</p>
        </div>
      </div>
    );

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
    <div className="rounded-xl border border-[#e3e3e3] shadow-sm bg-white overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-b border-[#e3e3e3] bg-gray-50">
            <TableHead className="font-bold text-black px-6 py-4 text-base">Problem Title</TableHead>
            <TableHead className="font-bold text-black px-6 py-4 text-base">Difficulty</TableHead>
            <TableHead className="font-bold text-black px-6 py-4 text-base">Tags</TableHead>
            <TableHead className="font-bold text-black px-6 py-4 text-base text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((pb, index) => (
            <TableRow 
              key={pb._id || pb.id} 
              className="hover:bg-gray-50 border-b border-[#e3e3e3] last:border-b-0 transition-colors"
            >
              <TableCell className="font-semibold text-black px-6 py-5 text-base">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold border border-[#e3e3e3]">
                    {index + 1}
                  </span>
                  {pb.title}
                </div>
              </TableCell>
              <TableCell className="px-6 py-5">
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${getDifficultyStyle(pb.difficulty)}`}>
                  {pb.difficulty}
                </span>
              </TableCell>
              <TableCell className="px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  {(pb.tags || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-lg border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                  {(pb.tags || []).length > 3 && (
                    <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-lg border border-gray-200">
                      +{(pb.tags || []).length - 3}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-6 py-5">
                <div className="flex justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(pb)}
                    className="border border-[#e3e3e3] text-black hover:bg-gray-50 shadow-sm px-4"
                  >
                    ✏️ Update
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(pb._id)}
                    className="shadow-sm px-4"
                  >
                    🗑️ Delete
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
