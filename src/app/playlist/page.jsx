"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPlaylists,
  deletePlaylist,
  updatePlaylist,
} from "../../redux/slices/playlistSlice";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Eye, Edit, Trash } from "lucide-react";

import { useRouter } from "next/navigation";

const PlaylistPage = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [playlistToEdit, setPlaylistToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const playlists = useSelector((state) => state.playlists.playlists);
  const loadingPlaylists = useSelector((state) => state.playlists.loading);

  useEffect(() => {
    dispatch(fetchAllPlaylists());
  }, [dispatch]);

  const openDeleteDialog = (playlist) => {
    setPlaylistToDelete(playlist);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deletePlaylist(playlistToDelete._id));
    setIsDeleteOpen(false);
    setPlaylistToDelete(null);
  };

  const openEditDialog = (playlist) => {
    setPlaylistToEdit(playlist);
    setEditTitle(playlist.title);
    setEditDescription(playlist.description);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    if (!playlistToEdit) return;
    dispatch(
      updatePlaylist({
        playlistId: playlistToEdit._id,
        updateData: { title: editTitle, description: editDescription },
      })
    );
    setIsEditOpen(false);
    setPlaylistToEdit(null);
  };

  const goToPlaylistProblems = (id) => {
    router.push(`/playlist/${id}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen space-y-8 bg-white">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[#e3e3e3] pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black">Your Playlists</h1>
          <p className="text-gray-600 mt-2">Manage and organize your coding problem collections</p>
        </div>
      </div>

      {/* Table */}
      {loadingPlaylists ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 border border-[#e3e3e3] rounded-xl bg-white shadow-sm"
            >
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-6 w-[350px]" />
              <Skeleton className="h-6 w-[80px]" />
              <Skeleton className="h-10 w-[240px]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-[#e3e3e3] rounded-xl overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e3e3e3] bg-gray-50">
                <TableHead className="w-[220px] font-bold text-black px-6 py-4">Title</TableHead>
                <TableHead className="font-bold text-black px-6 py-4">Description</TableHead>
                <TableHead className="font-bold text-black px-6 py-4">Problems</TableHead>
                <TableHead className="text-center font-bold text-black px-6 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlists.map((playlist) => (
                <TableRow key={playlist._id} className="hover:bg-gray-50 border-b border-[#e3e3e3] last:border-b-0">
                  <TableCell className="font-semibold text-black px-6 py-5">
                    {playlist.title}
                  </TableCell>
                  <TableCell className="text-gray-600 px-6 py-5">
                    {playlist.description}
                  </TableCell>
                  <TableCell className="text-black font-medium px-6 py-5">{playlist.problems.length}</TableCell>
                  <TableCell className="text-center px-6 py-5">
                    <div className="flex justify-center space-x-3">
                      <Button
                        size="sm"
                        onClick={() => goToPlaylistProblems(playlist._id)}
                        className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border border-[#e3e3e3] shadow-sm"
                      >
                        <Eye className="h-4 w-4" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(playlist)}
                        className="flex items-center gap-2 border border-[#e3e3e3] hover:bg-gray-50 text-black shadow-sm"
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(playlist)}
                        className="flex items-center gap-2 shadow-sm"
                      >
                        <Trash className="h-4 w-4" /> Delete
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => router.push("/problem")} 
                        className="flex items-center gap-2 bg-white text-black border border-[#e3e3e3] hover:bg-gray-50 shadow-sm"
                      >
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border border-[#e3e3e3] shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Delete Playlist
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-base mt-4">
            Are you sure you want to delete{" "}
            <strong className="text-black">{playlistToDelete?.title}</strong>? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-8">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              className="border border-[#e3e3e3] text-black hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={loadingPlaylists}
            >
              {loadingPlaylists ? (
                <>
                  <span className="inline-block animate-spin h-4 w-4 border-b-2 border-current mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border border-[#e3e3e3] shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black">
              Edit Playlist
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div>
              <label className="text-sm font-semibold text-black block mb-2">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border border-[#e3e3e3] focus:border-black transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-black block mb-2">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="border border-[#e3e3e3] focus:border-black transition-colors min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button 
              variant="outline" 
              onClick={() => setIsEditOpen(false)}
              className="border border-[#e3e3e3] text-black hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveEdit} 
              disabled={loadingPlaylists || !editTitle.trim()}
              className="bg-black text-white hover:bg-gray-800"
            >
              {loadingPlaylists ? (
                <>
                  <span className="inline-block animate-spin h-4 w-4 border-b-2 border-current mr-2" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaylistPage;
