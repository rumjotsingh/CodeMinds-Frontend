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
    <div className="p-6 max-w-6xl mx-auto min-h-screen space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Playlists</h1>
       
      </div>

      {/* Table */}
      {loadingPlaylists ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[300px]" />
              <Skeleton className="h-5 w-[60px]" />
              <Skeleton className="h-8 w-[200px]" />
            </div>
          ))}
        </div>
      ) : (
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>No. of Problems</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlists.map((playlist) => (
              <TableRow key={playlist._id} className="hover:bg-muted/40">
                <TableCell className="font-semibold">
                  {playlist.title}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {playlist.description}
                </TableCell>
                <TableCell>{playlist.problems.length}</TableCell>
                <TableCell className="text-center space-x-2 flex justify-center">
                  <Button
                    size="sm"
                    onClick={() => goToPlaylistProblems(playlist._id)}
                    className="flex gap-1"
                  >
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(playlist)}
                    className="flex gap-1"
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openDeleteDialog(playlist)}
                    className="flex gap-1"
                  >
                    <Trash className="h-4 w-4" /> Delete
                  </Button>
                   <Button size="sm"  onClick={() => router.push("/problem")} className="flex ">
          <Plus className="h-4 w-4" />
          Add
        </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Delete Playlist
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong>{playlistToDelete?.title}</strong>? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit Playlist
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={loadingPlaylists}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaylistPage;
