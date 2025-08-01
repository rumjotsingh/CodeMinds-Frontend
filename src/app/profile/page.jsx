'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea'; // Add if you have this component for bio multiline
import { useForm } from 'react-hook-form';
import { getUserProfile, updateUserProfile } from '../../redux/slices/authSlice';
import { toast } from 'sonner';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { profile, loading, error } = useSelector((state) => state.auth);

  // Extend defaultValues and form to handle new fields: phone and bio
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

  // Format join date for display if exists
  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : null;

  if (loading) {
    return (
      <Card className="max-w-md min-h-[600px] mx-auto mt-10 p-4">
        <Skeleton className="h-20 w-20 rounded-full mb-4 mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10 p-4 text-center text-red-500">
        Error: {error}
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader className="flex flex-col items-center justify-center">
        <Avatar className="h-24 w-24 mb-6 ring-4 ring-yellow-400">
          <AvatarImage src={profile?.avatarUrl} alt={profile?.name} />
          <AvatarFallback className="text-4xl">{profile?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-3xl font-semibold mb-1">{profile?.name}</CardTitle>
        <p className="text-gray-400 text-sm mb-4">
          Joined on {joinDate || 'N/A'}
        </p>
        <Button variant="outline" className="mb-2" onClick={() => setOpen(true)}>
          Edit Profile
        </Button>
      </CardHeader>

      <CardContent>
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 border-b border-yellow-400 pb-1">
            Contact Information
          </h3>
          <p className="text-gray-300 mb-1">
            <span className="font-medium">Email:</span> {profile?.email || 'N/A'}
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Phone:</span> {profile?.phone || 'Not provided'}
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3 border-b border-yellow-400 pb-1">
            About Me
          </h3>
          <p className="text-gray-300 whitespace-pre-wrap min-h-[60px]">
            {profile?.bio || 'No bio available.'}
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-yellow-400 pb-1">
            Account Stats
          </h3>
          {/* Placeholder stats: replace with real data if you have */}
          <ul className="text-gray-300 list-disc list-inside space-y-1">
            <li>Total Problems Solved: {profile?.totalSolved ?? '0'}</li>
            <li>Contests Participated: {profile?.contestCount ?? '0'}</li>
            <li>Ranking: {profile?.rank ?? 'N/A'}</li>
          </ul>
        </section>
      </CardContent>

      {/* EDIT PROFILE DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 mt-4"
            autoComplete="off"
          >
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
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
              <label className="block text-sm font-medium mb-1" htmlFor="email">
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

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">
                Phone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your phone number"
                {...register('phone', {
                  pattern: {
                    value: /^\+?[0-9]{7,15}$/,
                    message: 'Invalid phone number',
                  },
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="bio">
                Bio
              </label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Tell us about yourself"
                {...register('bio')}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfilePage;
