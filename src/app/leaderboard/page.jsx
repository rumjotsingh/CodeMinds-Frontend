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
        return <Trophy className="h-6 w-6 text-primary" />;
      case 2:
        return <Medal className="h-6 w-6 text-muted-foreground" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-primary text-primary-foreground";
      case 2:
        return "bg-muted text-foreground";
      case 3:
        return "bg-orange-500 text-white";
      default:
        return "bg-muted text-foreground";
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
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Top performers ranked by problems solved
          </p>
        </div>

        {/* Loading State */}
        {status === "loading" && (
          <Card className="bg-card rounded-2xl shadow-md border-border">
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
          <Card className="bg-card rounded-2xl shadow-md border border-destructive">
            <CardContent className="p-5">
              <div className="text-center text-destructive">
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
                <Card className="bg-card rounded-2xl shadow-md hover:shadow-lg transition mt-8 border-border">
                  <CardContent className="p-5 text-center">
                    <div className="flex justify-center mb-3">
                      <Medal className="h-14 w-14 text-muted-foreground" />
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-border">
                      <AvatarFallback className="text-lg font-bold bg-muted text-foreground">
                        {getInitials(users[1].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-foreground tracking-tight mb-1">
                      {users[1].name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{users[1].email}</p>
                    <Badge className="bg-muted text-foreground rounded-full px-4 py-2">
                      {users[1].problemsSolved} solved
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* 1st Place */}
              {users[0] && (
                <Card className="bg-card rounded-2xl shadow-lg hover:shadow-xl transition border-2 border-primary">
                  <CardContent className="p-5 text-center">
                    <div className="flex justify-center mb-3">
                      <Trophy className="h-16 w-16 text-primary" />
                    </div>
                    <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-primary">
                      <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                        {getInitials(users[0].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-xl text-foreground tracking-tight mb-1">
                      {users[0].name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{users[0].email}</p>
                    <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-2">
                      {users[0].problemsSolved} solved
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* 3rd Place */}
              {users[2] && (
                <Card className="bg-card rounded-2xl shadow-md hover:shadow-lg transition mt-8 border-border">
                  <CardContent className="p-5 text-center">
                    <div className="flex justify-center mb-3">
                      <Award className="h-14 w-14 text-orange-500" />
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-orange-400">
                      <AvatarFallback className="text-lg font-bold bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                        {getInitials(users[2].name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-foreground tracking-tight mb-1">
                      {users[2].name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">{users[2].email}</p>
                    <Badge className="bg-orange-500 text-white rounded-full px-4 py-2">
                      {users[2].problemsSolved} solved
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Full Leaderboard Table */}
            <Card className="bg-card rounded-2xl shadow-md hover:shadow-lg transition border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground tracking-tight">Rankings</CardTitle>
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
                            className="hover:bg-muted transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center justify-center">
                                {getRankIcon(rank)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className={`${rank <= 3 ? "font-bold" : ""} bg-muted text-foreground`}>
                                    {getInitials(user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className={`${rank <= 3 ? "font-bold" : "font-medium"} text-foreground`}>
                                  {user.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
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
                        className={`p-4 rounded-2xl bg-card shadow-md hover:shadow-lg transition ${
                          rank <= 3 ? "border-2 border-primary" : "border border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div>{getRankIcon(rank)}</div>
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className={`${rank <= 3 ? "font-bold" : ""} bg-muted text-foreground`}>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <Badge className={`${getRankBadgeColor(rank)} rounded-full px-3 py-1`}>
                            {user.problemsSolved} solved
                          </Badge>
                        </div>
                        <div>
                          <h3 className={`${rank <= 3 ? "font-bold" : "font-medium"} text-foreground`}>
                            {user.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
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
          <Card className="bg-card rounded-2xl shadow-md border-border">
            <CardContent className="p-8 text-center">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">
                No data available
              </h3>
              <p className="text-muted-foreground text-sm">
                The leaderboard will appear once users start solving problems
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
