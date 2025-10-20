"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { registerUser, loginWithGoogle } from "../redux/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";

// ✅ Define schema and form values
const formSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    
  })
 


export default function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
  console.log(errors);  

  const onSubmit = async (values) => {
    const res = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(res)) {
      toast("Registered successfully");
      router.push("/login");
    } else {
      toast.error(res.payload || "Something went wrong");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    const res = await dispatch(loginWithGoogle(id_token));
    if (loginWithGoogle.fulfilled.match(res)) {
      const role = res.payload?.user?.role;
      toast("Google login successful");
      router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    } else {
      toast.error(res.payload || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen  max-w-7xl mx-auto flex items-center justify-center  px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Register</h1>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
          className="w-full rounded-lg border border-border px-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
         {...register("name")} id="name" />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input   className="w-full rounded-lg border border-border px-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary" type="email" {...register("email")} id="email" />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                className="w-full pr-10 rounded-lg border border-border px-4 py-3 bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                id="password"
                
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-6 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-10">
            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>

            <div className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Login
              </button>
            </div>

            <div className="w-full text-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed")}
                useOneTap={false}
              />
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
