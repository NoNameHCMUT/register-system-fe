import Logo from "@/assets/logo.svg";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown, Menu } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { handleApiError } from "@/shared/api";

import {
  acceptPendingUserApi,
  getPendingUsersApi,
  type PendingUser,
} from "./api/accept.api";

const PENDING_USERS_QUERY_KEY = ["admin", "pending-users"];

function AcceptPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: pendingUsers = [], isLoading } = useQuery({
    queryKey: PENDING_USERS_QUERY_KEY,
    queryFn: getPendingUsersApi,
  });

  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(pendingUsers.map((user) => user.role))).sort();
    return [{ value: "all", label: "All" }, ...roles.map((role) => ({ value: role, label: role }))];
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

  const handleAcceptUser = (userId: number) => {
    if (acceptMutation.isPending) {
      return;
    }

    acceptMutation.mutate(userId);
  };

  return (
    <div className="flex min-h-svh flex-col bg-[#f4f5f8] text-[#10131a]">
      <header className="border-b border-[#d9dee8] bg-white">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4 px-4 py-5 md:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-md text-[#5f6675] transition-colors hover:bg-[#eef1f6]"
              aria-label="Open navigation"
            >
              <Menu className="size-8" />
            </button>

            <div className="flex items-center gap-3">
              <img src={Logo} alt="Mua He Xanh Online logo" className="h-10 w-10" />
              <div className="bg-gradient-to-br from-[#2890d4] to-[#00c7d4] bg-clip-text text-3xl font-semibold tracking-[-0.04em] text-transparent md:text-[44px] md:leading-none">
                Mua He Xanh Online
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 md:gap-10">
            <nav className="hidden items-center gap-8 text-[31px] text-[#445067] md:flex md:text-base">
              <a href="#" className="hover:text-[#1d9bf0]">Home</a>
              <a href="#" className="hover:text-[#1d9bf0]">Campaign</a>
              <a href="#" className="hover:text-[#1d9bf0]">About us</a>
            </nav>
            <Button className="h-10 rounded-xl bg-[#2196de] px-7 text-lg font-medium text-white hover:bg-[#1389d3] md:text-base">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
          <div className="flex justify-end">
            <div className="w-full max-w-[330px] space-y-2">
              <Label htmlFor="user-selection">USER SELECTION</Label>
              <div className="relative w-full">
                <select
                  id="user-selection"
                      value={roleFilter}
                      onChange={(event) => setRoleFilter(event.target.value)}
                  className="h-12 w-full appearance-none rounded-md border-0 bg-[#e8ebf0] px-4 text-xl text-[#222733] md:text-2xl"
                >
                      {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-6 -translate-y-1/2 text-[#2f3541]" />
              </div>
            </div>
          </div>

          <section className="rounded-lg border border-[#d1d7e1] bg-[#f4f5f8] px-5 py-7 md:px-14 md:py-8">
            <h2 className="text-3xl font-semibold text-[#1d74d2] md:text-[36px]">
              NEW REQUESTS ({filteredUsers.length})
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border border-[#8f98ad] bg-white">
              <table className="w-full border-collapse">
                <thead className="border-b border-[#8f98ad] bg-[#f8f9fc]">
                  <tr className="text-[#6e7588]">
                    <th className="px-5 py-4 text-left text-3xl font-semibold md:text-[42px]">USER</th>
                    <th className="px-5 py-4 text-left text-3xl font-semibold md:text-[42px]">REQUEST</th>
                    <th className="px-5 py-4 text-left text-3xl font-semibold md:text-[42px]">STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-lg text-[#6e7588] md:text-2xl">
                        Loading pending users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-lg text-[#6e7588] md:text-2xl">
                        No pending users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user: PendingUser) => (
                      <tr key={user.id} className="align-top">
                        <td className="px-5 py-6 text-2xl text-[#10131a] md:text-[36px]">{user.username}</td>
                        <td className="px-5 py-6 text-xl text-[#10131a] md:text-[36px] md:leading-[1.35]">
                          {user.fullName} ({user.email})
                        </td>
                        <td className="px-5 py-6">
                          <button
                            type="button"
                            onClick={() => handleAcceptUser(user.id)}
                            disabled={acceptMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-full bg-[#0e4db5] px-4 py-2 text-sm font-semibold tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-70 md:px-5 md:py-3 md:text-xl"
                          >
                            {acceptMutation.isPending ? "ACCEPTING" : "ACCEPT"}
                            <ChevronDown className="size-4 md:size-6" />
                          </button>
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
