"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-500">Unauthorized Access</h1>
        <p className="text-lg text-gray-600">
          You do not have permission to access this page.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => router.push("/dashboard/user")}
            variant="outline"
          >
            Go to User Dashboard
          </Button>
          <Button
            onClick={() => router.push("/login")}
            variant="default"
          >
            Login with Different Account
          </Button>
        </div>
      </div>
    </div>
  );
}