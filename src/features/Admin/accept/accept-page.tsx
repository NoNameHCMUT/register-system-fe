import Logo from "@/assets/logo.svg";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, Menu } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { handleApiError } from "@/shared/api";

import {
  acceptPendingUserApi,
  getPendingUsersApi,
  type PendingUser,
  rejectPendingUserApi,
} from "./api/accept.api";
import { handleLogout } from "@/features/Login/api/logout.api";

const PENDING_USERS_QUERY_KEY = ["admin", "pending-users"];

function AcceptPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState("all");
  const [userActions, setUserActions] = useState<
    Record<number, "accept" | "reject">
  >({});

  const { data: pendingUsers = [], isLoading } = useQuery({
    queryKey: PENDING_USERS_QUERY_KEY,
    queryFn: getPendingUsersApi,
  });

  const roleOptions = useMemo(() => {
    const roles = Array.from(
      new Set(pendingUsers.map((user) => user.role)),
    ).sort();
    return [
      { value: "all", label: "All" },
      ...roles.map((role) => ({ value: role, label: role })),
    ];
  }, [pendingUsers]);

  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") {
      return pendingUsers;
    }

    return pendingUsers.filter((user) => user.role === roleFilter);
  }, [pendingUsers, roleFilter]);

  const acceptMutation = useMutation({
    mutationFn: acceptPendingUserApi,
    onSuccess: (user) => {
      toast.success(`Accepted user ${user.username}.`);
      queryClient.invalidateQueries({ queryKey: PENDING_USERS_QUERY_KEY });
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

  const handleAcceptUser = (userId: number) => {
    if (acceptMutation.isPending) {
      return;
    }

    acceptMutation.mutate(userId);
  };

  const handleRejectUser = (userId: number) => {
    if (rejectMutation.isPending) {
      return;
    }

    rejectMutation.mutate(userId);
  };

  const handleActionChange = (userId: number, action: "accept" | "reject") => {
    setUserActions((prevActions) => ({
      ...prevActions,
      [userId]: action,
    }));
  };

  const handleSubmitAction = (userId: number) => {
    const selectedAction = userActions[userId] ?? "accept";

    if (selectedAction === "reject") {
      handleRejectUser(userId);
      return;
    }

    handleAcceptUser(userId);
  };

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  return (
    <div className="flex min-h-svh flex-col bg-[#f4f5f8] text-[#10131a]">
      <header className="border-b border-[#d9dee8] bg-white">
        <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-md text-[#5f6675] transition-colors hover:bg-[#eef1f6]"
              aria-label="Open navigation"
            >
              <Menu className="size-6" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={Logo}
                alt="Mua He Xanh Online logo"
                className="h-8 w-8"
              />
              <div className="bg-[#2890d4] bg-clip-text text-xl font-semibold tracking-[-0.02em] text-transparent md:text-3xl md:leading-none">
                Mua He Xanh Online
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden items-center gap-6 text-sm text-[#445067] md:flex md:text-base">
              <a href="#" className="hover:text-[#1d9bf0]">
                Home
              </a>
              <a href="#" className="hover:text-[#1d9bf0]">
                Campaign
              </a>
              <a href="#" className="hover:text-[#1d9bf0]">
                About us
              </a>
            </nav>
            <Button
              type="button"
              onClick={onLogout}
              className="h-9 rounded-xl bg-[#2196de] px-5 text-sm font-medium text-white hover:bg-[#1389d3]"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto flex w-full max-w-[980px] flex-col gap-5">
          <div className="flex justify-end">
            <div className="w-full max-w-[300px] space-y-2">
              <Label
                htmlFor="user-selection"
                className="text-xs tracking-[0.08em] text-[#5f6675]"
              >
                USER SELECTION
              </Label>
              <div className="relative w-full">
                <select
                  id="user-selection"
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                  className="h-10 w-full appearance-none rounded-md border-0 bg-[#e8ebf0] px-3 text-sm text-[#222733] md:text-base"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#2f3541]" />
              </div>
            </div>
          </div>

          <section className="rounded-lg border border-[#d1d7e1] bg-[#f4f5f8] px-4 py-5 md:px-8 md:py-6">
            <h2 className="text-xl font-semibold text-[#1d74d2] md:text-2xl">
              NEW REQUESTS ({filteredUsers.length})
            </h2>

            <div className="mt-4 overflow-x-auto rounded-xl border border-[#8f98ad] bg-white">
              <table className="w-full border-collapse">
                <thead className="border-b border-[#8f98ad] bg-[#f8f9fc]">
                  <tr className="text-[#6e7588]">
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-[0.08em] md:text-sm">
                      USER
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-[0.08em] md:text-sm">
                      AFFILIATION
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold tracking-[0.08em] md:text-sm">
                      STATUS
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-[#6e7588] md:text-base"
                      >
                        Loading pending users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-[#6e7588] md:text-base"
                      >
                        No pending users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user: PendingUser) => (
                      <tr key={user.id} className="align-top">
                        <td className="px-4 py-4 text-sm font-medium text-[#10131a] md:text-base">
                          {user.username}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#10131a] md:text-base md:leading-[1.35]">
                          {user.affiliation.stdName}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center">
                            <div className="w-full sm:max-w-[140px]">
                              <select
                                aria-label={`Select action for ${user.username}`}
                                value={userActions[user.id] ?? "accept"}
                                onChange={(event) =>
                                  handleActionChange(
                                    user.id,
                                    event.target.value as "accept" | "reject",
                                  )
                                }
                                disabled={
                                  acceptMutation.isPending ||
                                  rejectMutation.isPending
                                }
                                className="h-8 w-full rounded-full bg-[#0e4db5] px-3 text-[8px] font-semibold tracking-[0.06em] text-white disabled:cursor-not-allowed disabled:opacity-70 md:h-9 md:px-4 md:text-xs"
                              >
                                <option value="accept">ACCEPT</option>
                                <option value="reject">REJECT</option>
                              </select>
                            </div>

                            <Button
                              type="button"
                              onClick={() => handleSubmitAction(user.id)}
                              disabled={
                                acceptMutation.isPending ||
                                rejectMutation.isPending
                              }
                              className="h-8 rounded-full bg-[#0a3f94] px-3 text-[10px] font-semibold tracking-[0.06em] text-white hover:bg-[#08357f] disabled:cursor-not-allowed disabled:opacity-70 md:h-9 md:px-4 md:text-xs"
                            >
                              Submit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export { AcceptPage };
