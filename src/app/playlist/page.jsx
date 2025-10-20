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
    <div className="p-8 max-w-7xl mx-auto min-h-screen space-y-8 bg-background text-foreground">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">Your Playlists</h1>
          <p className="text-muted-foreground mt-2">Manage and organize your coding problem collections</p>
        </div>
      </div>

      {/* Table */}
      {loadingPlaylists ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 border border-border rounded-xl bg-card shadow-sm"
            >
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-6 w-[350px]" />
              <Skeleton className="h-6 w-[80px]" />
              <Skeleton className="h-10 w-[240px]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted">
                <TableHead className="w-[220px] font-bold text-primary px-6 py-4">Title</TableHead>
                <TableHead className="font-bold text-primary px-6 py-4">Description</TableHead>
                <TableHead className="font-bold text-primary px-6 py-4">Problems</TableHead>
                <TableHead className="text-center font-bold text-primary px-6 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlists.map((playlist) => (
                <TableRow key={playlist._id} className="hover:bg-muted border-b border-border last:border-b-0">
                  <TableCell className="font-semibold text-foreground px-6 py-5">
                    {playlist.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground px-6 py-5">
                    {playlist.description}
                  </TableCell>
                  <TableCell className="text-foreground font-medium px-6 py-5">{playlist.problems.length}</TableCell>
                  <TableCell className="text-center px-6 py-5">
                    <div className="flex justify-center space-x-3">
                      <Button
                        size="sm"
                        onClick={() => goToPlaylistProblems(playlist._id)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 border border-border shadow-sm"
                      >
                        <Eye className="h-4 w-4" /> View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(playlist)}
                        className="flex items-center gap-2 border border-border hover:bg-muted text-foreground shadow-sm"
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
                        className="flex items-center gap-2 bg-muted text-foreground border border-border hover:bg-muted-foreground shadow-sm"
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
        <DialogContent className="border border-border shadow-lg bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              Delete Playlist
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-base mt-4">
            Are you sure you want to delete{" "}
            <strong className="text-primary">{playlistToDelete?.title}</strong>? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-8">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              className="border border-border text-foreground hover:bg-muted"
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
        <DialogContent className="border border-border shadow-lg bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              Edit Playlist
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div>
              <label className="text-sm font-semibold text-primary block mb-2">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border border-border focus:border-primary transition-colors bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-primary block mb-2">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="border border-border focus:border-primary transition-colors min-h-[100px] bg-input text-foreground"
              />
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button 
              variant="outline" 
              onClick={() => setIsEditOpen(false)}
              className="border border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveEdit} 
              disabled={loadingPlaylists || !editTitle.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
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
