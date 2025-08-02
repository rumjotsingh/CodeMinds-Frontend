"use client";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDashboard } from "../../../redux/slices/DashbordSlice";
import { fetchStreaks } from "../../../redux/slices/StreaksSlice";
import CalendarHeatmap from "../../../Component/CalendarHeatmap";
import RecentSubmissions from "../../../Component/RecentSubmissions";
import UserAvatar from './../../../Component/UserAvator';

export default function Dashboard() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard.data);
  const streaks = useSelector((state) => state.streaks.data);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchStreaks());
  }, [dispatch]); 

  const streakDays = streaks ? Object.keys(streaks).length : 0;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl min-h-screen mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Coding Dashboard</h2>
            <p className="text-orange-500">Streak: 🔥 {streakDays} days</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboard?.totalProblemsSolved || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboard?.totalSubmissions || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Correct</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboard?.totalCorrect || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Heatmap */}
      <div>
        <CalendarHeatmap data={streaks} />
      </div>

      {/* Recent Submissions */}
      <div>
        <RecentSubmissions submissions={dashboard?.recentSubmissions || []} />
      </div>
    </div>
  );
}
