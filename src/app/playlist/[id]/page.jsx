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
      <div className="max-w-6xl mx-auto py-10 space-y-8 min-h-screen bg-white px-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-8 w-2/3" />
        <Separator className="border-[#e3e3e3]" />
        <Skeleton className="h-10 w-48" />
        <div className="rounded-xl border border-[#e3e3e3] shadow-sm bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e3e3e3] bg-gray-50">
                <TableHead className="w-[220px] font-bold text-black px-6 py-4">Title</TableHead>
                <TableHead className="font-bold text-black px-6 py-4">Tags</TableHead>
                <TableHead className="font-bold text-black px-6 py-4">Difficulty</TableHead>
                <TableHead className="text-center font-bold text-black px-6 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i} className="border-b border-[#e3e3e3] last:border-b-0">
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
        </div>
      </div>
    );
  }

  if (!currentPlaylist) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-white">
        <div className="text-center space-y-4">
          <p className="text-gray-600 text-xl">Playlist not found</p>
          <Button 
            onClick={() => router.push('/playlist')}
            className="bg-black text-white hover:bg-gray-800 border border-[#e3e3e3]"
          >
            Back to Playlists
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8 min-h-screen bg-white px-8">
      {/* Playlist Info */}
      <Card className="shadow-lg border border-[#e3e3e3] bg-white">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold text-black mb-4">
            {currentPlaylist?.title}
          </CardTitle>
          <p className="text-gray-600 text-lg leading-relaxed">
            {currentPlaylist?.description}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-[#e3e3e3]">
              <span className="text-sm font-semibold text-black">
                {currentPlaylist?.problems?.length || 0} Problem{(currentPlaylist?.problems?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <Button
              onClick={() => router.push('/playlist')}
              variant="outline"
              className="border border-[#e3e3e3] text-black hover:bg-gray-50"
            >
              ← Back to Playlists
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Separator className="border-[#e3e3e3]" />

      {/* Problems List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">
              Problems in this Playlist
            </h2>
            <p className="text-gray-600 mt-1">
              {currentPlaylist?.problems?.length || 0} problem{(currentPlaylist?.problems?.length || 0) !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button
            onClick={() => router.push('/problem')}
            className="bg-black text-white hover:bg-gray-800 border border-[#e3e3e3] shadow-sm"
          >
            Add More Problems
          </Button>
        </div>
        {currentPlaylist?.problems?.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-[#e3e3e3]">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-black mb-2">No problems in this playlist yet</h3>
              <p className="text-gray-600 mb-6">Start building your collection by adding some coding problems to practice.</p>
              <Button
                onClick={() => router.push('/problem')}
                className="bg-black text-white hover:bg-gray-800 px-6 py-3"
              >
                Browse Problems to Add
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e3e3e3] shadow-sm bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#e3e3e3] bg-gray-50">
                  <TableHead className="w-[250px] font-bold text-black px-6 py-4">Problem Title</TableHead>
                  <TableHead className="font-bold text-black px-6 py-4">Tags</TableHead>
                  <TableHead className="font-bold text-black px-6 py-4">Difficulty</TableHead>
                  <TableHead className="text-center font-bold text-black px-6 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPlaylist?.problems.map((play) => {
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
                    <TableRow key={play._id} className="hover:bg-gray-50 border-b border-[#e3e3e3] last:border-b-0">
                      <TableCell className="font-semibold text-black px-6 py-5">{play.title}</TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {play?.tags?.slice(0, 3)?.map((tag) => (
                            <Badge key={tag} variant="outline" className="border-[#e3e3e3] text-gray-700">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <Badge className={`${getDifficultyColor(play.difficulty)} border font-medium`}>
                          {play.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center px-6 py-5">
                        <div className="flex justify-center gap-3">
                          <Button
                            size="sm"
                            onClick={() => router.push(`/problem/${play._id}`)}
                            className="bg-black text-white hover:bg-gray-800 shadow-sm"
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
                            <AlertDialogContent className="border border-[#e3e3e3] shadow-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold text-black">
                                  Remove Problem from Playlist?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 text-base">
                                  This action cannot be undone. The problem will be
                                  removed from <strong className="text-black">{currentPlaylist.title}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border border-[#e3e3e3] text-black hover:bg-gray-50">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
    