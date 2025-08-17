"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboard,
} from "../../../redux/slices/DashbordSlice";
import {
  fetchStreaks,
} from "../../../redux/slices/StreaksSlice";
import {
  fetchAllPlaylists,
  deletePlaylist,
  updatePlaylist,
} from "../../../redux/slices/playlistSlice";
import CalendarHeatmap from "../../../Component/CalendarHeatmap";
import RecentSubmissions from "../../../Component/RecentSubmissions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const dashboard = useSelector((state) => state.dashboard.data);
  const streaks = useSelector((state) => state.streaks.data);
  const playlists = useSelector((state) => state.playlists.playlists);
  const loadingPlaylists = useSelector((state) => state.playlists.loading);
  const error = useSelector((state) => state.playlists.error);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [playlistToEdit, setPlaylistToEdit] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchStreaks());
    dispatch(fetchAllPlaylists());
  }, [dispatch]);

  const streakDays = streaks ? Object.keys(streaks).length : 0;

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
    router.push(`/problem?playlist=${id}`);
  };

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            Coding Dashboard
          </h1>
          <p className="text-lg text-orange-600 mt-1">
            🔥 Current Streak: {streakDays} days
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Total Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">
              {dashboard?.totalProblemsSolved || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {dashboard?.totalSubmissions || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition">
          <CardHeader>
            <CardTitle>Correct</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {dashboard?.totalCorrect || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Heatmap */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Activity</h2>
        <CalendarHeatmap data={streaks} />
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
        <RecentSubmissions submissions={dashboard?.recentSubmissions || []} />
      </div>

      {/* Playlists */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
        {loadingPlaylists && <p>Loading playlists...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loadingPlaylists && playlists.length === 0 && (
          <p className="text-gray-500">No playlists found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Card
              key={playlist._id}
              className="shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {playlist.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between flex-1">
                <p className="mb-4 text-sm text-gray-600">
                  {playlist.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => goToPlaylistProblems(playlist._id)}
                  >
                    View Problems
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(playlist)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openDeleteDialog(playlist)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playlist</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
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
            <DialogTitle>Edit Playlist</DialogTitle>
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
}
