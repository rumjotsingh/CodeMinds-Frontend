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
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            {!loadingStreaks && (
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-[#ff9500]">🔥</span>
                <span className="font-medium">{streakDays}</span>
                <span className="text-[#eff1f6bf]">day streak</span>
              </div>
            )}
          </div>
          <p className="text-sm text-[#eff1f6bf]">
            Track your progress and recent activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {loadingDashboard ? (
            <>
              <Skeleton className="h-24 w-full rounded bg-[#303030]" />
              <Skeleton className="h-24 w-full rounded bg-[#303030]" />
              <Skeleton className="h-24 w-full rounded bg-[#303030]" />
              <Skeleton className="h-24 w-full rounded bg-[#303030]" />
            </>
          ) : (
            <>
              <div className="border border-[#303030] rounded-lg bg-[#282828] p-4 hover:bg-[#303030]/50 transition">
                <div className="text-xs text-[#eff1f6bf] mb-1">Problems Solved</div>
                <div className="text-2xl font-semibold">
                  {dashboard?.totalProblemsSolved || 0}
                </div>
              </div>

              <div className="border border-[#303030] rounded-lg bg-[#282828] p-4 hover:bg-[#303030]/50 transition">
                <div className="text-xs text-[#eff1f6bf] mb-1">Total Submissions</div>
                <div className="text-2xl font-semibold">
                  {dashboard?.totalSubmissions || 0}
                </div>
              </div>

              <div className="border border-[#303030] rounded-lg bg-[#282828] p-4 hover:bg-[#303030]/50 transition">
                <div className="text-xs text-[#eff1f6bf] mb-1">Accepted</div>
                <div className="text-2xl font-semibold text-[#00b8a3]">
                  {dashboard?.totalCorrect || 0}
                </div>
              </div>

              <div className="border border-[#303030] rounded-lg bg-[#282828] p-4 hover:bg-[#303030]/50 transition">
                <div className="text-xs text-[#eff1f6bf] mb-1 flex items-center gap-1">
                  <span>Streak</span>
                  <span className="text-[#ff9500]">🔥</span>
                </div>
                <div className="text-2xl font-semibold text-[#ff9500]">{streakDays}</div>
              </div>
            </>
          )}
      </div>

        {/* Calendar Heatmap */}
        <div className="border border-[#303030] rounded-lg bg-[#282828] p-4">
          <h2 className="text-sm font-medium mb-4">Activity</h2>
          {loadingStreaks ? (
            <Skeleton className="h-[150px] w-full rounded bg-[#303030]" />
          ) : (
            <CalendarHeatmap data={streaks} />
          )}
        </div>

        {/* Recent Submissions */}
        <div className="border border-[#303030] rounded-lg bg-[#282828] p-4 mt-6">
          <h2 className="text-sm font-medium mb-4">Recent Submissions</h2>
          {loadingDashboard ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded bg-[#303030]" />
              <Skeleton className="h-10 w-full rounded bg-[#303030]" />
              <Skeleton className="h-10 w-full rounded bg-[#303030]" />
            </div>
          ) : (
            <RecentSubmissions submissions={dashboard?.recentSubmissions || []} />
          )}
        </div>
      </div>
    </div>
  );
}
