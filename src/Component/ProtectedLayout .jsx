// components/ProtectedLayout.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAuth } from "@/context/authContext";

export function ProtectedLayout({ role, children }) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only redirect after initial auth check is complete
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user?.role !== role) {
        router.replace("/unauthorized");
      }
    }
  }, [isAuthenticated, loading, role, router, user]);

  // Show loading spinner during initial auth check
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show nothing while redirecting
  if (!isAuthenticated || user?.role !== role) {
    return null;
  }

  // Show content when authenticated and authorized
  return <>{children}</>;
}
