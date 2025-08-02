"use client";

import { ProtectedLayout } from "@/Component/ProtectedLayout ";

export default function UserDashboardLayout({ children }) {
  return <ProtectedLayout role="user">{children}</ProtectedLayout>;
}