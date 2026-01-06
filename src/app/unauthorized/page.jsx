"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#ff375f]/10 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-[#ff375f]" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#eff1f6]">Access Denied</h1>
            <p className="text-sm text-[#eff1f6bf]">
              You don&apos;t have permission to access this page.
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={() => router.push("/dashboard/user")}
              variant="outline"
              size="sm"
              className="h-9"
            >
              User Dashboard
            </Button>
            <Button
              onClick={() => router.push("/login")}
              size="sm"
              className="h-9"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}