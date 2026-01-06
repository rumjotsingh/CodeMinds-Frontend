'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginUser } from '@/redux/slices/authSlice';
import { registerUser, loginWithGoogle } from "../redux/slices/authSlice";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react'; // Eye icons
 import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const router = useRouter();

  const { user, loading, error } = useSelector((state) => state.auth);
 

  // Handle navigation when authenticated
  useEffect(() => {
    if (user && !isNavigating) {
      setIsNavigating(true);
      router.replace(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/user');
    }
  }, [user, isNavigating, router]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (user) {
      toast('Login successful!');
      setIsNavigating(true);
      if (user.role === 'admin') {
        router.replace('/dashboard/admin');
      } else {
        router.replace('/dashboard/user');
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (error) {
      toast(error);
      setIsNavigating(false);
    }
  }, [error]);
 const handleGoogleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    const res =  dispatch(loginWithGoogle(id_token));
    if (loginWithGoogle.fulfilled.match(res)) {
      const role = res.payload?.user?.role;
      toast("Google login successful");
      router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    } else {
      toast.error(res.payload || "Google login failed");
    }
  };
  return (
    <div className="min-h-screen max-w-7xl mx-auto flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#eff1f6]">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <Input
              className="w-full rounded-lg border border-[#303030] px-4 py-3 bg-[#1a1a1a] text-[#eff1f6] placeholder:text-[#eff1f6bf] focus:outline-none focus:ring-2 focus:ring-[#00b8a3]"
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && (
              <p className="text-[#ff375f] text-sm">{errors.email.message}</p>
            )}

            {/* Password Field with Toggle */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full rounded-lg border border-[#303030] px-4 py-3 bg-[#1a1a1a] text-[#eff1f6] placeholder:text-[#eff1f6bf] focus:outline-none focus:ring-2 focus:ring-[#00b8a3]"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-[#eff1f6bf]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#ff375f] text-sm">{errors.password.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-sm text-[#eff1f6bf] text-center">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-[#00b8a3] hover:underline cursor-pointer"
              >
                Register
              </button>
            </div>

            <div className="w-full text-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                useOneTap={false}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
