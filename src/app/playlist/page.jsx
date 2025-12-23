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

  const playlists = useSelector((state) => state.playlists?.playlists || []);
  const loadingPlaylists = useSelector((state) => state.playlists?.loading || false);
  const error = useSelector((state) => state.playlists?.error);
  console.log(playlists);
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen space-y-6 bg-background text-foreground">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Your Playlists</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage and organize your coding problem collections</p>
        </div>
      </div>

      {/* Table */}
      {error && (
        <div className="border border-red-200 bg-red-50 text-red-800 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Error loading playlists:</p>
          <p className="text-sm">{error.message || 'An unexpected error occurred'}</p>
        </div>
      )}
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
        <>
          {/* No playlists message */}
          {playlists.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 mb-4 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No playlists yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first playlist to start organizing your coding problems into collections.
              </p>
              <Button onClick={() => router.push("/problem")} className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Playlist
              </Button>
            </div>
          ) : (
            <>
          {/* Desktop Table View */}
          <div className="hidden md:block border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/50">
                <TableHead className="w-[220px] font-semibold px-6 py-3">Title</TableHead>
                <TableHead className="font-semibold px-6 py-3">Description</TableHead>
                <TableHead className="font-semibold px-6 py-3">Problems</TableHead>
                <TableHead className="text-center font-semibold px-6 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlists.map((playlist) => (
                <TableRow key={playlist._id} className="hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors">
                  <TableCell className="font-semibold text-foreground px-6 py-4">
                    {playlist.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground px-6 py-4 text-sm">
                    {playlist.description}
                  </TableCell>
                  <TableCell className="text-foreground font-medium px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {playlist.problemCount} problem{playlist.problemCount !== 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell className="text-center px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => goToPlaylistProblems(playlist._id)}
                        className="flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                      <Button
                        size="sm"
                        
                        onClick={() => openEditDialog(playlist)}
                        className="flex items-center gap-1.5 border-border shadow-sm"
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(playlist)}
                        className="flex items-center gap-1.5 shadow-sm"
                      >
                        <Trash className="h-3.5 w-3.5" /> Delete
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => router.push("/problem")} 
                      
                        className="flex items-center gap-1.5 border-border shadow-sm"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="border border-border rounded-lg bg-card shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow">
              <div>
                <h3 className="font-bold text-base text-foreground">{playlist.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{playlist.description}</p>
                 <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {playlist.problemCount} problem{playlist.problemCount !== 1 ? 's' : ''}
                </div> 
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  onClick={() => goToPlaylistProblems(playlist._id)}
                  className="flex items-center justify-center gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(playlist)}
                  className="flex items-center justify-center gap-1.5 border-border"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openDeleteDialog(playlist)}
                  className="flex items-center justify-center gap-1.5"
                >
                  <Trash className="h-3.5 w-3.5" /> Delete
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => router.push("/problem")} 
                  variant="outline"
                  className="flex items-center justify-center gap-1.5 border-border"
                >
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </div>
          ))}
        </div>
        </>
          )}
        </>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border border-border shadow-lg bg-card text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Delete Playlist
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm mt-2">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{playlistToDelete?.title}</strong>? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-6 gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              className="border border-border"
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
        <DialogContent className="border border-border shadow-lg bg-card text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Playlist
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium block mb-2">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border border-border focus:border-primary transition-colors bg-input text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="border border-border focus:border-primary transition-colors min-h-[100px] bg-input text-foreground"
              />
            </div>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditOpen(false)}
              className="border border-border"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveEdit} 
              disabled={loadingPlaylists || !editTitle.trim()}
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
