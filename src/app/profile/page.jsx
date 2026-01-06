"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  getUserProfile,
  updateUserProfile,
  getUserStats,
} from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { fetchDashboard } from "./../../redux/slices/DashbordSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { profile, loading, error, stats } = useSelector((state) => state.auth);
  const dashboard = useSelector((state) => state.dashboard.data);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(getUserProfile());
    dispatch(getUserStats());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        email: profile.email || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(updateUserProfile(data));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      toast.success("Profile updated successfully!");
      setOpen(false);
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  /** ---------- SKELETON LOADER ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6 bg-[#303030]" />

          <div className="space-y-6">
            <div className="border border-[#303030] rounded-lg bg-[#282828] p-5">
              <Skeleton className="h-6 w-40 mb-4 bg-[#303030]" />
              <Skeleton className="h-4 w-64 mb-2 bg-[#303030]" />
              <Skeleton className="h-4 w-52 mb-3 bg-[#303030]" />
              <Skeleton className="h-9 w-28 bg-[#303030]" />
            </div>

            <div className="border border-[#303030] rounded-lg bg-[#282828] p-5">
              <Skeleton className="h-6 w-40 mb-4 bg-[#303030]" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="border border-[#303030] rounded-lg p-3 bg-[#1a1a1a]">
                    <Skeleton className="h-8 w-12 mb-2 bg-[#303030]" />
                    <Skeleton className="h-3 w-16 bg-[#303030]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-[#ff375f] text-center">Error: {error}</p>
        </div>
      </div>
    );
  }

  /** ---------- MAIN CONTENT ---------- */
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>

        <div className="space-y-6 max-w-5xl">
          {/* User Information */}
          <div className="border border-[#303030] rounded-lg bg-[#282828] p-5">
            <h2 className="text-sm font-medium mb-4">User Information</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-[#eff1f6bf]">Email:</span>{" "}
                <span className="font-medium">{profile?.email || "N/A"}</span>
              </div>
              <div>
                <span className="text-[#eff1f6bf]">Name:</span>{" "}
                <span className="font-medium">{profile?.name || "N/A"}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              className="mt-4 h-9"
            >
              Edit Profile
            </Button>
          </div>

          {/* Account Stats */}
          <div className="border border-[#303030] rounded-lg bg-[#282828] p-5">
            <h2 className="text-sm font-medium mb-4">Account Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="border border-[#303030] rounded-lg p-3 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold mb-1">
                  {stats?.totalSolved || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Total Solved</div>
              </div>
              <div className="border border-[#303030] rounded-lg p-3 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold text-[#00b8a3] mb-1">
                  {stats?.easy || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Easy</div>
              </div>
              <div className="border border-[#303030] rounded-lg p-3 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold text-[#ffc01e] mb-1">
                  {stats?.medium || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Medium</div>
              </div>
              <div className="border border-[#303030] rounded-lg p-3 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold text-[#ff375f] mb-1">
                  {stats?.hard || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Hard</div>
              </div>
              <div className="border border-[#303030] rounded-lg p-3 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold mb-1">
                  {stats?.totalAttempts || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Attempts</div>
              </div>
              <div className="border border-[#303030] rounded-lg p-3 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold text-[#ff9500] mb-1">
                  {stats?.streak || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Streak 🔥</div>
              </div>
            </div>
          </div>

          {/* Submission Stats */}
          <div className="border border-[#303030] rounded-lg bg-[#282828] p-5">
            <h2 className="text-sm font-medium mb-4">Submission Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[#303030] rounded-lg p-4 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold mb-1">
                  {dashboard?.totalProblemsSolved || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Problems Solved</div>
              </div>
              <div className="border border-[#303030] rounded-lg p-4 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold mb-1">
                  {dashboard?.totalSubmissions || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Total Submissions</div>
              </div>
              <div className="border border-[#303030] rounded-lg p-4 bg-[#1a1a1a] hover:bg-[#303030]/50 transition">
                <div className="text-2xl font-semibold text-[#00b8a3] mb-1">
                  {dashboard?.totalCorrect || 0}
                </div>
                <div className="text-xs text-[#eff1f6bf]">Accepted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="max-w-md bg-[#282828] border-[#303030] text-[#eff1f6]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
              autoComplete="off"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                  Name <span className="text-[#ff375f]">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  {...register("name", { required: "Name is required" })}
                  className="h-9"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email <span className="text-[#ff375f]">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="h-9"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfilePage;
