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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Problems</h2>
        <Button variant="default" onClick={onCreateClick}>
          + Create Problem
        </Button>
      </div>

      <ProblemsTable items={items} onEdit={onEditClick} onDelete={onDeleteClick} />

      {openForm && (
        <ProblemForm initialValues={editProblem} onClose={onCloseForm} />
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={!!toDeleteId} onOpenChange={() => setToDeleteId(null)}>
        <DialogPortal>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Delete Problem</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete this problem? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setToDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
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
      <p className="text-center text-muted-foreground py-10">No problems found.</p>
    );

  return (
    <Table className="w-full">
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((pb) => (
          <TableRow key={pb._id || pb.id}>
            <TableCell className="font-medium">{pb.title}</TableCell>
            <TableCell>{pb.difficulty}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {(pb.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(pb)}
              >
                Update
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(pb._id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
