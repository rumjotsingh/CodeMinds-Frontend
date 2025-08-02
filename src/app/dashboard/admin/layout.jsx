"use client";

import { ProtectedLayout } from "@/Component/ProtectedLayout ";

export default function AdminDashboardLayout({ children }) {
  return <ProtectedLayout role="admin">{children}</ProtectedLayout>;
}