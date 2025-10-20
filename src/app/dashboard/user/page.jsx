"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../../redux/slices/DashbordSlice";
import { fetchStreaks } from "../../../redux/slices/StreaksSlice";
import {
  fetchAllPlaylists,
  deletePlaylist,
  updatePlaylist,
} from "../../../redux/slices/playlistSlice";

import CalendarHeatmap from "../../../Component/CalendarHeatmap";
import RecentSubmissions from "../../../Component/RecentSubmissions";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHub, Sparkles } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const dashboard = useSelector((state) => state.dashboard.data);
  const loadingDashboard = useSelector((state) => state.dashboard.loading);

  const streaks = useSelector((state) => state.streaks.data);
  const loadingStreaks = useSelector((state) => state.streaks.loading);

 

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchStreaks());
    dispatch(fetchAllPlaylists());
  }, [dispatch]);

  const streakDays = streaks ? Object.keys(streaks).length : 0;

  

  

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto bg-background text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
            Coding Dashboard
          </h1>
          {loadingStreaks ? (
            <Skeleton className="h-6 w-40 mt-2" />
          ) : (
            <p className="text-lg text-orange-600 mt-1">
              🔥 Current Streak: {streakDays} days
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 space-x-1.5 space-y-1.5">
        {loadingDashboard ? (
          <>
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </>
        ) : (
          <>
            <Card className="bg-card border border-border text-foreground">
              <CardHeader>
                <CardTitle className="text-primary">Total Solved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {dashboard?.totalProblemsSolved || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border text-foreground">
              <CardHeader>
                <CardTitle className="text-primary">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {dashboard?.totalSubmissions || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border text-foreground">
              <CardHeader>
                <CardTitle className="text-primary">Correct</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">
                  {dashboard?.totalCorrect || 0}
                </p>
              </CardContent>
            </Card>
            {/* Streak card */}
            <Card className="bg-card border border-border text-foreground">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Sparkles className="size-5 text-yellow-500" /> Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{streakDays} days</p>
                <p className="text-sm text-muted-foreground mt-2">Keep the streak going — solve at least one problem every day.</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Calendar Heatmap */}
      <div className="max-w-7xl">
        <h2 className="text-xl font-semibold mb-4 text-primary">Activity</h2>
        {loadingStreaks ? (
          <Skeleton className="h-[150px] w-full rounded-xl" />
        ) : (
          <CalendarHeatmap data={streaks} />
        )}
      </div>

      {/* Recent Submissions */}
      <div className="bg-card max-w-7xl border border-border rounded-xl shadow-sm text-foreground">
        <h2 className="text-xl font-semibold mb-4 text-primary">Recent Submissions</h2>
        {loadingDashboard ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ) : (
          <RecentSubmissions submissions={dashboard?.recentSubmissions || []} />
        )}
      </div>
    </div>
  );
}
