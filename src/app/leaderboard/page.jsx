"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLeaderboard } from "../../redux/slices/leaderboardSlice";
import { Trophy, Medal, Award, User, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-[#ffc01e]" />;
      case 2:
        return <Medal className="h-6 w-6 text-[#eff1f6bf]" />;
      case 3:
        return <Award className="h-6 w-6 text-[#ff9500]" />;
      default:
        return <span className="text-sm font-semibold text-[#eff1f6bf]">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-[#ffc01e] text-black";
      case 2:
        return "bg-[#eff1f6bf] text-black";
      case 3:
        return "bg-[#ff9500] text-white";
      default:
        return "bg-[#303030] text-[#eff1f6]";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Leaderboard</h1>
          <p className="text-sm text-[#eff1f6bf]">
            Top performers ranked by problems solved
          </p>
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <div className="space-y-2">
            {[...Array(15)].map((_, idx) => (
              <Skeleton key={idx} className="h-12 w-full rounded bg-[#303030]" />
            ))}
          </div>
        )}

        {/* Error State */}
        {status === "failed" && (
          <div className="text-center py-8 text-[#ff375f]">{error}</div>
        )}

        {/* Leaderboard Table */}
        {status === "succeeded" && users && users.length > 0 && (
          <div className="border border-[#303030] rounded-lg overflow-hidden bg-[#282828]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#303030] bg-[#1a1a1a] text-xs font-medium text-[#eff1f6bf]">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">User</div>
              <div className="col-span-2">Problems Solved</div>
              <div className="col-span-2">Submissions</div>
              <div className="col-span-2">Accuracy</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#303030]">
              {users.map((user, index) => {
                const rank = index + 1;
                const accuracy = user.totalSubmissions > 0 
                  ? ((user.totalAccepted / user.totalSubmissions) * 100).toFixed(1)
                  : 0;

                return (
                  <div
                    key={user._id}
                    className={`grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-[#303030]/50 ${
                      rank <= 3 ? 'bg-[#00b8a3]/5' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1">
                      {rank <= 3 ? (
                        getRankIcon(rank)
                      ) : (
                        <span className="text-sm font-medium">#{rank}</span>
                      )}
                    </div>

                    {/* User */}
                    <div className="col-span-5 flex items-center gap-2">
                      <Avatar className="w-8 h-8 border border-[#303030]">
                        <AvatarFallback className="bg-[#00b8a3] text-white text-xs">
                          {getInitials(user.name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {user.name || user.email}
                        </div>
                        {user.college && (
                          <div className="text-xs text-[#eff1f6bf] truncate">
                            {user.college}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Problems Solved */}
                    <div className="col-span-2">
                      <span className="font-semibold text-[#00b8a3]">{user.totalProblemsSolved || 0}</span>
                    </div>

                    {/* Submissions */}
                    <div className="col-span-2">
                      <span className="text-sm">{user.totalSubmissions || 0}</span>
                    </div>

                    {/* Accuracy */}
                    <div className="col-span-2">
                      <span className="text-sm font-medium">{accuracy}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {status === "succeeded" && (!users || users.length === 0) && (
          <div className="text-center py-20 text-[#eff1f6bf]">
            No users in leaderboard yet
          </div>
        )}
      </div>
    </div>
  );
}
