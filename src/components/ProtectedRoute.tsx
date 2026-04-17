import { useGetUser } from "@/shared/get-user";
import { AdminHome } from "@/features/Admin/AdminHome";
import CommunityDashboard from "@/features/Community/Dashboard/cDashboard";
import { StudentHome } from "@/features/Student";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("accessToken");
  const { data: me, isLoading, isError } = useGetUser(Boolean(token));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return null;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  if (!children) {
    if (me?.role === "admin") {
      return <AdminHome />;
    }

    if (me?.role === "community") {
      return <CommunityDashboard />;
    }

    if (me?.role === "student") {
      return <StudentHome />;
    }

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
