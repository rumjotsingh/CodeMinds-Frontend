"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Login from '../../Component/Login';

export default function LoginPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md rounded-xl  p-8">
        <Login />
      </div>
    </div>
  );
}
