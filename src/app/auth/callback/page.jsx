"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginWithGoogle } from "@/store/slices/authSlice";
import { id } from "zod/v4/locales";

const GoogleCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const id_token = searchParams.get("token");
    console.log(id_token);

    if (!id_token) {
      router.push("/login");
      return;
    }

    dispatch(loginWithGoogle(id_token))
      .unwrap()
      .then((res) => {
        const role = res?.user?.role;

        if (role === "admin") {
          router.push("/admin/dashboard");
        }  else {
          router.push("/user/dashboard"); // default or fallback
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [dispatch, router, searchParams]);

  return <div className="p-4 text-center">Logging in with Google...</div>;
};

export default GoogleCallback;
