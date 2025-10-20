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
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-orange-500 text-white";
      default:
        return "bg-[#E5E7EB] dark:bg-[#1E293B] text-gray-800 dark:text-gray-200";
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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="h-10 w-10 text-[#6366F1] mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-[#111827] dark:text-[#E2E8F0] tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Top performers ranked by problems solved
          </p>
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-md">
            <CardContent className="p-5">
              <div className="space-y-4">
                {[...Array(10)].map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {status === "failed" && (
          <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-red-200">
            <CardContent className="p-5">
              <div className="text-center text-red-600">
                <p className="font-semibold">Failed to load leaderboard</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Content */}
        {status === "succeeded" && users.length > 0 && (
          <>
            {/* Top 3 Podium - Desktop Only */}
            <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              {users[1] && (
                <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition mt-8">
                  <CardContent className="p-5 text-center">
                    <div className="flex justify-center mb-3">
                      <Medal className="h-14 w-14 text-gray-400" />
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-gray-300">
                      <AvatarFallback className="text-lg font-bold bg-[#E5E7EB] dark:bg-[#1E293B] text-[#111827] dark:text-[#E2E8F0]">
                        {getInitials(users[1].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-[#111827] dark:text-[#E2E8F0] tracking-tight mb-1">
                      {users[1].name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{users[1].email}</p>
                    <Badge className="bg-gray-400 text-white rounded-full px-4 py-2">
                      {users[1].problemsSolved} solved
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* 1st Place */}
              {users[0] && (
                <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition border-2 border-[#6366F1]">
                  <CardContent className="p-5 text-center">
                    <div className="flex justify-center mb-3">
                      <Trophy className="h-16 w-16 text-[#6366F1]" />
                    </div>
                    <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-[#6366F1]">
                      <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white">
                        {getInitials(users[0].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-xl text-[#111827] dark:text-[#E2E8F0] tracking-tight mb-1">
                      {users[0].name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{users[0].email}</p>
                    <Badge className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white rounded-full px-4 py-2">
                      {users[0].problemsSolved} solved
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* 3rd Place */}
              {users[2] && (
                <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition mt-8">
                  <CardContent className="p-5 text-center">
                    <div className="flex justify-center mb-3">
                      <Award className="h-14 w-14 text-orange-500" />
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-orange-400">
                      <AvatarFallback className="text-lg font-bold bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                        {getInitials(users[2].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-[#111827] dark:text-[#E2E8F0] tracking-tight mb-1">
                      {users[2].name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{users[2].email}</p>
                    <Badge className="bg-orange-500 text-white rounded-full px-4 py-2">
                      {users[2].problemsSolved} solved
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Full Leaderboard Table */}
            <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#111827] dark:text-[#E2E8F0] tracking-tight">Rankings</CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Problems Solved</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, index) => {
                        const rank = index + 1;
                        return (
                          <TableRow
                            key={user.userId}
                            className={`${
                              rank <= 3 ? "bg-gray-50" : ""
                            } hover:bg-gray-100 transition-colors`}
                          >
                            <TableCell>
                              <div className="flex items-center justify-center">
                                {getRankIcon(rank)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className={`${rank <= 3 ? "font-bold" : ""} bg-[#E5E7EB] dark:bg-[#1E293B] text-[#111827] dark:text-[#E2E8F0]`}>
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className={`${rank <= 3 ? "font-bold" : "font-medium"} text-[#111827] dark:text-[#E2E8F0]`}>
                                  {user.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">
                              {user.email}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                className={`${getRankBadgeColor(rank)} rounded-full px-4 py-1`}
                              >
                                {user.problemsSolved}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {users.map((user, index) => {
                    const rank = index + 1;
                    return (
                      <div
                        key={user.userId}
                        className={`p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition ${
                          rank <= 3 ? "border-2 border-[#6366F1]" : "border border-[#CBD5E1] dark:border-[#1E293B]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div>{getRankIcon(rank)}</div>
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className={`${rank <= 3 ? "font-bold" : ""} bg-[#E5E7EB] dark:bg-[#1E293B] text-[#111827] dark:text-[#E2E8F0]`}>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <Badge className={`${getRankBadgeColor(rank)} rounded-full px-3 py-1`}>
                            {user.problemsSolved} solved
                          </Badge>
                        </div>
                        <div>
                          <h3 className={`${rank <= 3 ? "font-bold" : "font-medium"} text-[#111827] dark:text-[#E2E8F0]`}>
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {status === "succeeded" && users.length === 0 && (
          <Card className="bg-white dark:bg-slate-800 rounded-2xl shadow-md">
            <CardContent className="p-8 text-center">
              <Trophy className="h-16 w-16 text-[#6366F1] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#E2E8F0] tracking-tight mb-2">
                No data available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The leaderboard will appear once users start solving problems
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
