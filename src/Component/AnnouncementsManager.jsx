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
    <div className="space-y-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#e3e3e3] w-full">
        <div>
          <h2 className="text-3xl font-bold text-black mb-2">Announcements Management</h2>
          <p className="text-gray-600">Create, edit, and manage platform announcements</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="bg-gray-50 px-3 py-1 rounded-lg border border-[#e3e3e3]">
              <span className="text-sm font-semibold text-black">{items.length} Total Announcements</span>
            </div>
            <div className="bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              <span className="text-sm font-semibold text-blue-800">Active</span>
            </div>
          </div>
        </div>
        <Button 
          variant="default" 
          onClick={onCreateClick}
          className="bg-black text-white hover:bg-gray-800 shadow-lg px-6 py-3 text-base font-semibold border border-[#e3e3e3]"
        >
          ✨ Create New Announcement
        </Button>
      </div>

      {status === "loading" && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <span className="inline-block animate-spin h-6 w-6 border-b-2 border-black" />
            <span className="text-gray-600">Loading announcements...</span>
          </div>
        </div>
      )}

      {items.length === 0 && status !== "loading" && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-[#e3e3e3] border-dashed">
          <span className="text-6xl mb-4 block">📢</span>
          <h3 className="text-xl font-semibold text-black mb-2">No announcements created yet</h3>
          <p className="text-gray-600 mb-6">Create your first announcement to get started.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="rounded-xl border border-[#e3e3e3] shadow-sm bg-white overflow-hidden">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-[#e3e3e3] bg-gray-50">
                <TableHead className="font-bold text-black px-6 py-4 text-base">Title</TableHead>
                <TableHead className="font-bold text-black px-6 py-4 text-base">Message</TableHead>
                <TableHead className="font-bold text-black px-6 py-4 text-base text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item._id} className="hover:bg-gray-50 border-b border-[#e3e3e3] last:border-b-0 transition-colors">
                  <TableCell className="font-semibold text-black px-6 py-5 text-base">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold border border-[#e3e3e3]">
                        {index + 1}
                      </span>
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-gray-700">
                    <div className="max-w-md truncate">{item.message}</div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditClick(item)}
                        className="border border-[#e3e3e3] text-black hover:bg-gray-50 shadow-sm px-4"
                      >
                        ✏️ Update
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteClick(item._id)}
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
      )}

      {/* Enhanced Create/Update Form Dialog */}
      <Dialog open={openForm} onOpenChange={closeForm}>
        <DialogPortal>
          <DialogContent className="sm:max-w-lg border border-[#e3e3e3] shadow-xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
                <span className="text-2xl">📢</span>
                {editData ? "Update" : "Create"} Announcement
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                Please enter the title and message for the announcement.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-semibold text-black">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="border border-[#e3e3e3] focus:border-black h-12 text-base mt-2"
                  aria-invalid={errors.title ? "true" : "false"}
                  required
                  autoFocus
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="message" className="text-base font-semibold text-black">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleInputChange}
                  className="border border-[#e3e3e3] focus:border-black min-h-[120px] text-base mt-2"
                  rows={4}
                  aria-invalid={errors.message ? "true" : "false"}
                  required
                />
                {errors.message && (
                  <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                )}
              </div>
              <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-[#e3e3e3]">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={closeForm}
                  className="border border-[#e3e3e3] text-black hover:bg-gray-50 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 px-6 shadow-sm"
                >
                  {editData ? "✏️ Update" : "✨ Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog open={!!toDeleteId} onOpenChange={closeDeleteDialog}>
        <DialogPortal>
          <DialogContent className="sm:max-w-lg border border-[#e3e3e3] shadow-xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-black flex items-center gap-3">
                <span className="text-red-500">⚠️</span>
                Delete Announcement
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                Are you sure you want to permanently delete this announcement? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-[#e3e3e3]">
              <Button 
                variant="outline" 
                onClick={closeDeleteDialog}
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
