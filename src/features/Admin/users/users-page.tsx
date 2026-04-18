import { Footer } from "@/components/Footer";
import {
  Search,
  ArrowLeft,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { handleApiError } from "@/shared/api";
import { UserHeader } from "@/components/UserHeader";
import { useGetUser } from "@/shared/get-user";

import {
  acceptPendingUserApi,
  getPendingUsersApi,
  type PendingUser,
  rejectPendingUserApi,
} from "./api/users.api";
import { handleLogout } from "@/features/Login/api/logout.api";

const PENDING_USERS_QUERY_KEY = ["admin", "pending-users"];

interface ExtendedUser extends PendingUser {
  status: "APPROVED" | "PENDING";
  joinedDate: string;
  phone: string;
}

function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useGetUser();

  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState<"list" | "detail">("list");
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);

  const { data: pendingUsers = [], isLoading } = useQuery({
    queryKey: PENDING_USERS_QUERY_KEY,
    queryFn: getPendingUsersApi,
  });

  const acceptMutation = useMutation({
    mutationFn: acceptPendingUserApi,
    onSuccess: (user) => {
      toast.success(`Accepted user ${user.username}.`);
      queryClient.invalidateQueries({ queryKey: PENDING_USERS_QUERY_KEY });
      if (viewState === "detail" && selectedUser?.id === user.id) {
        setViewState("list");
      }
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectPendingUserApi,
    onSuccess: (user) => {
      toast.success(`Rejected user ${user.username}.`);
      queryClient.invalidateQueries({ queryKey: PENDING_USERS_QUERY_KEY });
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const extendedPendingUsers: ExtendedUser[] = useMemo(() => {
    return pendingUsers.map((u) => ({
      ...u,
      status: "PENDING",
      joinedDate: "N/A",
      phone: "N/A",
    }));
  }, [pendingUsers]);

  const allUsers = useMemo(() => {
    return [...extendedPendingUsers].filter(
      (u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [extendedPendingUsers, searchQuery]);

  const displayedUsers =
    activeTab === "all"
      ? allUsers
      : allUsers.filter((u) => u.status === "PENDING");

  const handleAcceptUser = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!acceptMutation.isPending) {
      acceptMutation.mutate(userId);
    }
  };

  const handleRejectUser = (userId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!rejectMutation.isPending) {
      rejectMutation.mutate(userId);
    }
  };

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  const renderStatusBadge = (status: "APPROVED" | "PENDING") => {
    if (status === "APPROVED") {
      return (
        <span className="inline-flex w-[100px] items-center justify-center gap-1.5 rounded-full bg-[#a1eca4] py-1 text-[11px] font-bold tracking-widest text-[#0a4b0d]">
          <div className="h-1.5 w-1.5 rounded-full bg-[#0a4b0d]" />
          APPROVED
        </span>
      );
    }
    return (
      <span className="inline-flex w-[100px] items-center justify-center gap-1.5 rounded-full bg-[#ff4d4f] py-1 text-[11px] font-bold tracking-widest text-white">
        <div className="h-1.5 w-1.5 rounded-full bg-[#ffc53d]" />
        PENDING
      </span>
    );
  };

  const totalUsersCount = 1284;
  const pendingCount = 12;

  if (viewState === "detail" && selectedUser) {
    return (
      <div className="flex min-h-svh flex-col bg-[#f8f9fc] text-[#10131a]">
        <UserHeader role={me?.role} onLogout={onLogout} />
        <main className="flex-1 px-4 py-8 md:px-8 xl:px-12">
          <div className="mx-auto w-full max-w-[1120px]">
            <button
              onClick={() => setViewState("list")}
              className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-[#445067] transition-colors hover:text-[#10131a]"
            >
              <ArrowLeft className="h-5 w-5" />
              BACK TO USERS
            </button>
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#e2e6f0]">
              <div className="relative p-8 md:p-10">
                <div className="flex gap-6 items-start justify-between">
                  <div className="flex gap-6 items-start">
                    <div className="relative">
                      <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-[#dce9fe] text-3xl font-bold text-[#1e5bbf]">
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </div>
                      {/* Floating badge */}
                      <div className="absolute -bottom-3 -right-6 flex justify-center scale-110">
                        {renderStatusBadge(selectedUser.status)}
                      </div>
                    </div>
                    <div className="pt-2">
                      <h1 className="text-4xl font-bold tracking-tight text-[#111827]">
                        {selectedUser.username}
                      </h1>
                      <div className="mt-2 flex items-center gap-1.5 text-[15px] font-semibold text-[#1d74d2]">
                        <ShieldCheck className="h-5 w-5" />
                        {selectedUser.role}
                      </div>
                    </div>
                  </div>

                  {selectedUser.status === "PENDING" && (
                    <div className="flex flex-col items-end pt-2">
                      <button
                        onClick={() => acceptMutation.mutate(selectedUser.id)}
                        disabled={acceptMutation.isPending}
                        className="rounded-xl cursor-pointer bg-[#0a4b0d] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#063309] disabled:opacity-70"
                      >
                        {acceptMutation.isPending
                          ? "Approving..."
                          : "Approve user"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex gap-8 border-b border-[#e2e6f0]">
                  <div className="flex items-center gap-2 border-b-2 border-[#1d74d2] pb-4 px-1 text-sm font-bold text-[#1d74d2]">
                    <Search className="h-4 w-4" />
                    Overview
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-xs font-bold tracking-[0.15em] text-[#5f6675]">
                    BASIC IDENTITY
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                      <div className="text-[11px] font-bold tracking-wider text-[#5f6675]">
                        EMAIL ADDRESS
                      </div>
                      <div className="mt-2 text-sm font-medium text-[#111827]">
                        {selectedUser.email}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold tracking-wider text-[#5f6675]">
                        PHONE NUMBER
                      </div>
                      <div className="mt-2 text-sm font-medium text-[#111827]">
                        {selectedUser.phone}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold tracking-wider text-[#5f6675]">
                        JOIN DATE
                      </div>
                      <div className="mt-2 text-sm font-medium text-[#111827]">
                        {selectedUser.joinedDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold tracking-wider text-[#5f6675]">
                        AFFILIATIONS
                      </div>
                      <div className="mt-2 text-sm font-medium text-[#111827]">
                        {selectedUser.affiliation?.stdName || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#f8f9fc] text-[#10131a]">
      <UserHeader role={me?.role} onLogout={onLogout} />

      <main className="flex-1 px-4 py-8 md:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-[1120px]">
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#0047AB] md:text-[34px]">
            List Users
          </h1>
          <p className="mt-1.5 max-w-5xl text-sm text-slate-500 md:text-base">
            Manage all users in the system, including approving or rejecting
            pending registration requests.
          </p>
          <div className="mt-8 flex gap-8 border-b border-[#e2e6f0]">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-3 border-b-2 pb-4 ${activeTab === "all"
                ? "border-[#1d74d2] text-[#1d74d2]"
                : "border-transparent text-[#5f6675] hover:text-[#111827]"
                }`}
            >
              <span className="text-[15px] font-bold">Approved</span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold ${activeTab === "all"
                  ? "bg-[#e1effe] text-[#1e5bbf]"
                  : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}
              >
                {totalUsersCount.toLocaleString()}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-3 border-b-2 pb-4 ${activeTab === "pending"
                ? "border-[#1d74d2] text-[#1d74d2]"
                : "border-transparent text-[#5f6675] hover:text-[#111827]"
                }`}
            >
              <span className="text-[15px] font-bold">Pending requests</span>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold ${activeTab === "pending"
                  ? "bg-[#e1effe] text-[#1e5bbf]"
                  : "bg-[#f3f4f6] text-[#6b7280]"
                  }`}
              >
                {pendingCount}
              </span>
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm">
              <div className="pl-3 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search user by name, email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-gray-400"
              />
              <button className="rounded-full bg-[#1a56db] px-6 py-2 text-sm font-semibold text-white hover:bg-[#1e40af]">
                Search
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl bg-[#f4f5f8]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f4f5f8]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold tracking-[0.1em] text-[#5f6675]">
                      USER DETAILS
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-[0.1em] text-[#5f6675]">
                      ROLE
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-[0.1em] text-[#5f6675]">
                      {activeTab === "all" && "JOINED DATE"}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-[0.1em] text-[#5f6675]">
                      STATUS
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-[0.1em] text-[#5f6675]">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : displayedUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    displayedUsers.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => {
                          setSelectedUser(user);
                          setViewState("detail");
                        }}
                        className="group cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#dce9fe] text-lg font-bold text-[#1e5bbf]">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-[#111827]">
                                {user.username}
                              </div>
                              <div className="text-[13px] text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-md bg-[#e1effe] px-2.5 py-1 text-[13px] font-semibold text-[#1e5bbf]">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[15px] text-[#445067]">
                          {activeTab === "all" ? user.joinedDate : ""}
                        </td>
                        <td className="px-6 py-5">
                          {renderStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-5">
                          {user.status === "PENDING" && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleAcceptUser(user.id, e)}
                                className="rounded text-[13px] cursor-pointer font-semibold text-blue-600 hover:text-blue-800"
                              >
                                Accept
                              </button>
                              <button
                                onClick={(e) => handleRejectUser(user.id, e)}
                                className="rounded text-[13px] cursor-pointer font-semibold text-red-600 hover:text-red-800"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between bg-white px-6 py-4">
              <div className="text-[13px] font-medium text-gray-500">
                Showing <span className="font-bold text-gray-900">1-10</span> of{" "}
                {totalUsersCount.toLocaleString()} users
              </div>
              <div className="flex items-center gap-1">
                <button className="flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded bg-[#1a56db] text-sm font-semibold text-white">
                  1
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export { UsersPage };
