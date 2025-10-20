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
} from "../../redux/slices/authSlice";
import { toast } from "sonner";
import { fetchDashboard } from "./../../redux/slices/DashbordSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { profile, loading, error } = useSelector((state) => state.auth);
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
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10 bg-background text-foreground">
        {/* Header Skeleton */}
        <div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* User Info Skeleton */}
        <section className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </section>

        {/* Stats Skeleton */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-muted border border-border rounded-lg p-6 text-center"
            >
              <Skeleton className="h-10 w-20 mx-auto mb-2" />
              <Skeleton className="h-5 w-24 mx-auto" />
            </div>
          ))}
        </section>
      </div>
    );
  }

  /** ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-card rounded-xl shadow-sm border border-border">
        <p className="text-destructive text-center text-lg">Error: {error}</p>
      </div>
    );
  }

  /** ---------- MAIN CONTENT ---------- */
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-background text-foreground">
      {/* User Information */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b border-primary pb-2 text-primary">
          User Information
        </h2>
        <p className="text-muted-foreground mb-2">
          <span className="font-medium">Email:</span> {profile?.email || "N/A"}
        </p>
        <p className="text-muted-foreground mb-2">
          <span className="font-medium">Name:</span> {profile?.name || "N/A"}
        </p>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="mt-3 border-border text-foreground hover:bg-muted"
        >
          Edit Profile
        </Button>
      </section>

      {/* Account Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-6 border-b border-primary pb-2 text-primary">
          Account Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-muted border border-border rounded-lg p-6 text-center">
            <p className="text-3xl font-bold mb-1 text-primary">
              {dashboard?.totalProblemsSolved || 0}
            </p>
            <p className="font-medium text-muted-foreground">Total Solved</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-6 text-center">
            <p className="text-3xl font-bold mb-1 text-primary">
              {dashboard?.totalSubmissions || 0}
            </p>
            <p className="font-medium text-muted-foreground">Total Submissions</p>
          </div>
          <div className="bg-muted border border-border rounded-lg p-6 text-center">
            <p className="text-3xl font-bold mb-1 text-primary">
              {dashboard?.totalCorrect || 0}
            </p>
            <p className="font-medium text-muted-foreground">Correct</p>
          </div>
        </div>
      </section>

      {/* Edit Profile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-lg bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">Edit Profile</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 mt-4"
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 text-primary"
              >
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                {...register("name", { required: "Name is required" })}
                className="bg-input text-foreground border border-border"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-primary"
              >
                Email <span className="text-destructive">*</span>
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
                className="bg-input text-foreground border border-border"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-2 bg-primary text-primary-foreground">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
