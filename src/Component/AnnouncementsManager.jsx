"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../redux/slices/announcementSlice";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogPortal,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


import { toast } from 'sonner';

export default function AnnouncementsManager() {
  const dispatch = useDispatch();
  const { items = [], status } = useSelector((state) => state.announcement || {});

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const [toDeleteId, setToDeleteId] = useState(null);

  const [form, setForm] = useState({ title: "", message: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  function onCreateClick() {
    setForm({ title: "", message: "" });
    setEditData(null);
    setErrors({});
    setOpenForm(true);
  }

  function onEditClick(announcement) {
    setForm({ title: announcement.title, message: announcement.message });
    setEditData(announcement);
    setErrors({});
    setOpenForm(true);
  }

  function onDeleteClick(id) {
    setToDeleteId(id);
  }

  async function handleConfirmDelete() {
    try {
      await dispatch(deleteAnnouncement(toDeleteId)).unwrap();
      toast("Announcement deleted successfully.");
      setToDeleteId(null);
    } catch (error) {
      toast("Failed to delete announcement.");
    }
  }

  function closeForm() {
    setOpenForm(false);
    setEditData(null);
    setErrors({});
  }
  function closeDeleteDialog() {
    setToDeleteId(null);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editData) {
        await dispatch(updateAnnouncement({ id: editData._id, updateData: form })).unwrap();
        toast("Announcement updated successfully.");
      } else {
        await dispatch(createAnnouncement(form)).unwrap();
        toast("Announcement created successfully.");
      }
      closeForm();
    } catch (error) {
      toast("An error occurred. Please try again.");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Announcements</h2>
        <Button variant="default" onClick={onCreateClick}>
          + Create Announcement
        </Button>
      </div>

      {status === "loading" && (
        <p className="text-center py-10 text-gray-500">Loading...</p>
      )}

      {items.length === 0 && status !== "loading" && (
        <p className="text-center py-10 text-gray-500">No announcements found.</p>
      )}

      {items.length > 0 && (
        <Table className="w-full">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.message}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditClick(item)}
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteClick(item._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create/Update Form Dialog */}
      <Dialog open={openForm} onOpenChange={closeForm}>
        <DialogPortal>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editData ? "Update" : "Create"} Announcement</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Please enter the title and message for the announcement.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  aria-invalid={errors.title ? "true" : "false"}
                  required
                  autoFocus
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="message" className="font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  rows={4}
                  aria-invalid={errors.message ? "true" : "false"}
                  required
                />
                {errors.message && (
                  <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                )}
              </div>
              <DialogFooter className="flex justify-end space-x-3">
                <Button variant="outline" type="button" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit">{editData ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!toDeleteId} onOpenChange={closeDeleteDialog}>
        <DialogPortal>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Announcement</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete this announcement? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end space-x-3">
              <Button variant="outline" onClick={closeDeleteDialog}>
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
