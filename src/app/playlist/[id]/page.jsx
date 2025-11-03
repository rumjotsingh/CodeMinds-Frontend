"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";
import {
  getPlaylistById,
  removeProblemFromPlaylist,
} from "../../../redux/slices/playlistSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const PlaylistPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentPlaylist, loading } = useSelector((state) => state.playlists);
  console.log("currentPlaylist", currentPlaylist);

  useEffect(() => {
    dispatch(getPlaylistById(id));
  }, [dispatch, id]);

  const handleRemoveProblem = async (problemId) => {
    try {
      await dispatch(
        removeProblemFromPlaylist({
          playlistId: currentPlaylist._id,
          problemId: problemId,
        })
      );
      // Refresh the playlist data after removal
      setTimeout(() => {
        dispatch(getPlaylistById(id));
      }, 500);
    } catch (error) {
      console.error('Error removing problem:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 space-y-8 min-h-screen bg-background px-4 sm:px-8 text-foreground">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Separator className="border-border" />
        <Skeleton className="h-9 w-40" />
        <Card className="rounded-xl border border-border shadow-sm bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted">
                <TableHead className="w-[220px] font-semibold px-6 py-4">Title</TableHead>
                <TableHead className="font-semibold px-6 py-4">Tags</TableHead>
                <TableHead className="font-semibold px-6 py-4">Difficulty</TableHead>
                <TableHead className="text-center font-semibold px-6 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i} className="border-b border-border last:border-b-0">
                  <TableCell className="px-6 py-5">
                    <Skeleton className="h-6 w-40" />
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell className="flex justify-end gap-3 px-6 py-5">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-background text-foreground">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">Playlist not found</p>
          <Button 
            onClick={() => router.push('/playlist')}
            variant="outline"
            className="border border-border"
          >
            Back to Playlists
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6 min-h-screen bg-background px-4 sm:px-8 text-foreground">
      {/* Playlist Info */}
      <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold mb-2">
            {currentPlaylist?.title}
          </CardTitle>
          <CardContent className="p-0">
            <p className="text-muted-foreground">
              {currentPlaylist?.description}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="px-3 py-1.5 rounded-md border border-border bg-muted">
                <span className="text-xs font-medium">
                  {currentPlaylist?.problems?.length || 0} Problem{(currentPlaylist?.problems?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>
              <Button
                onClick={() => router.push('/playlist')}
                variant="outline"
                className="border border-border"
              >
                ← Back to Playlists
              </Button>
            </div>
          </CardContent>
        </CardHeader>
      </Card>

      <Separator className="border-border" />

      {/* Problems List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Problems in this Playlist
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {currentPlaylist?.problems?.length || 0} problem{(currentPlaylist?.problems?.length || 0) !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button
            onClick={() => router.push('/problem')}
            className="shadow-sm"
          >
            Add More Problems
          </Button>
        </div>
  {!currentPlaylist?.problems?.length ? (
          <Card className="text-center py-12 bg-card rounded-xl border border-border">
            <CardContent className="max-w-md mx-auto">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">No problems in this playlist yet</h3>
              <p className="text-muted-foreground mb-6">Start building your collection by adding some coding problems to practice.</p>
              <Button
                onClick={() => router.push('/problem')}
                className="px-6"
              >
                Browse Problems to Add
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
          <Card className="hidden md:block rounded-xl border border-border shadow-sm bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted">
                  <TableHead className="w-[250px] font-semibold px-6 py-4">Problem Title</TableHead>
                  <TableHead className="font-semibold px-6 py-4">Tags</TableHead>
                  <TableHead className="font-semibold px-6 py-4">Difficulty</TableHead>
                  <TableHead className="text-center font-semibold px-6 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(currentPlaylist?.problems ?? []).map((play) => {
                  const getDifficultyColor = (difficulty) => {
                    switch (difficulty) {
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
                    <TableRow key={play._id} className="hover:bg-muted border-b border-border last:border-b-0">
                      <TableCell className="font-semibold px-6 py-5">{play.title}</TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {play?.tags?.slice(0, 3)?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="border border-border">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge variant={play.difficulty === 'EASY' ? 'success' : play.difficulty === 'MEDIUM' ? 'warning' : 'destructive'} className="border font-medium">
                          {play.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <Button
                            size="sm"
                            onClick={() => router.push(`/problem/${play._id}`)}
                            className="shadow-sm"
                          >
                            Solve
                          </Button>

                          {/* Remove Button with AlertDialog */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="shadow-sm"
                              >
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border border-border shadow-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold">
                                  Remove Problem from Playlist?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground text-base">
                                  This action cannot be undone. The problem will be
                                  removed from <strong>{currentPlaylist.title}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border border-border hover:bg-muted">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveProblem(play._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {loading ? (
                                    <>
                                      <span className="inline-block animate-spin h-4 w-4 border-b-2 border-current mr-2" />
                                      Removing...
                                    </>
                                  ) : (
                                    "Yes, Remove"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {(currentPlaylist?.problems ?? []).map((play) => (
              <Card key={play._id} className="border border-border bg-card shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-base mb-1">{play.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {play?.tags?.slice(0, 3)?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={play.difficulty === 'EASY' ? 'success' : play.difficulty === 'MEDIUM' ? 'warning' : 'destructive'} className="text-xs">
                      {play.difficulty}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/problem/${play._id}`)}
                    >
                      Solve
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="flex-1">
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border border-border shadow-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-lg font-bold">
                            Remove Problem?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground text-sm">
                            Remove <strong>{play.title}</strong> from <strong>{currentPlaylist.title}</strong>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border border-border">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveProblem(play._id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {loading ? "Removing..." : "Yes, Remove"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
    