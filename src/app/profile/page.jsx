'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { getUserProfile, updateUserProfile } from '../../redux/slices/authSlice';
import { toast } from 'sonner';
import { fetchDashboard } from './../../redux/slices/DashbordSlice';

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
      name: '',
      email: '',
      phone: '',
      bio: '',
    },
  });

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    const resultAction = await dispatch(updateUserProfile(data));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      toast.success('Profile updated successfully!');
      setOpen(false);
    } else {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Skeleton className="h-24 w-24 rounded-full mb-6" />
        <Skeleton className="h-8 w-48 mb-3" />
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-red-600 text-center text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      

      {/* Contact Information */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b border-yellow-400 pb-2">
          User Information
        </h2>
         
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Email:</span>{' '}
                {profile?.email || 'N/A'}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Name:</span>{' '}
                {profile?.name || 'N/A'}
              </p>
               <Button variant="outline" onClick={() => setOpen(true)} className="mt-3">
          Edit Profile
        </Button>
            
      </section>
       

      {/* About Me */}
      

      {/* Account Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-6 border-b border-yellow-400 pb-2">
          Account Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold mb-1">
              {dashboard?.totalProblemsSolved || 0}
            </p>
            <p className="font-medium">Total Solved</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold mb-1">
              {dashboard?.totalSubmissions || 0}
            </p>
            <p className="font-medium">Total Submissions</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold mb-1">
              {dashboard?.totalCorrect || 0}
            </p>
            <p className="font-medium">Correct</p>
          </div>
        </div>
      </section>

      {/* Edit Profile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 mt-4"
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                {...register('name', { required: 'Name is required' })}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>

           

           

            <Button type="submit" disabled={isSubmitting} className="mt-2">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
