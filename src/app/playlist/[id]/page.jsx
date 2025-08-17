"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

  useEffect(() => {
    dispatch(getPlaylistById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6 min-h-screen">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Separator />
        <Skeleton className="h-8 w-40" />
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground text-lg">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6 min-h-screen">
      {/* Playlist Info */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Title: {currentPlaylist?.title}
          </CardTitle>
          <p className="text-muted-foreground">
            Description: {currentPlaylist?.description}
          </p>
        </CardHeader>
      </Card>

      <Separator />

      {/* Problems List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Problems in this Playlist
        </h2>
        {currentPlaylist?.problems?.length === 0 ? (
          <p className="text-muted-foreground">No problems added yet.</p>
        ) : (
          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPlaylist?.problems.map((play) => (
                  <TableRow key={play._id}>
                    <TableCell className="font-medium">{play.title}</TableCell>
                    <TableCell className="text-muted-foreground space-x-1">
                      {play?.tags?.slice(0, 3)?.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {play.difficulty}
                    </TableCell>
                    <TableCell className="text-right gap-2 flex justify-end">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/problem/${play._id}`)}
                      >
                        Solve
                      </Button>

                      {/* Remove Button with AlertDialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {}}
                          >
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove Problem from Playlist?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The problem will be
                              removed from <b>{currentPlaylist.title}</b>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                dispatch(
                                  removeProblemFromPlaylist({
                                    playlistId: currentPlaylist._id,
                                    problemId: play._id,
                                  })
                                )
                              }
                            >
                              Yes, Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
    