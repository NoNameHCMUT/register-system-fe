import { useNavigate } from "react-router-dom";
import { Search, ShieldCheck, ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";

import { Footer } from "@/components/Footer";
import { UserHeader } from "@/components/UserHeader";
import { useGetUser } from "@/shared/get-user";
import { handleLogout } from "@/features/Login/api/logout.api";

export function MyProfile() {
  const navigate = useNavigate();
  const { data: me, isLoading } = useGetUser();

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  const renderStatusBadge = (status?: string) => {
    const isApproved = status === "ACCEPTED" || status === "APPROVED" || status === "active" || status === "ACTIVE";
    return isApproved ? (
      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#0a4b0d] text-white">
        <ShieldCheck className="h-3 w-3" />
      </div>
    ) : (
      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#d97706] text-white">
        <Clock className="h-3 w-3" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f8f9fc]">
        <p className="text-sm font-medium text-[#5f6675]">Loading profile...</p>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f8f9fc]">
        <p className="text-sm font-medium text-red-500">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#f8f9fc] text-[#10131a]">
      <UserHeader role={me?.role} onLogout={onLogout} />
      <main className="flex-1 px-4 py-8 md:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-[1120px]">
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-sm font-bold tracking-widest text-[#445067] transition-colors hover:text-[#10131a]"
          >
            <ArrowLeft className="h-5 w-5" />
            BACK TO DASHBOARD
          </button>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#e2e6f0]">
            <div className="relative p-8 md:p-10">
              <div className="flex gap-6 items-start justify-between">
                <div className="flex gap-6 items-start">
                  <div className="relative">
                    <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-[#dce9fe] text-3xl font-bold text-[#1e5bbf]">
                      {me.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                    {/* Floating badge */}
                    <div className="absolute -bottom-3 -right-6 flex justify-center scale-110">
                      {renderStatusBadge(me.status)}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h1 className="text-4xl font-bold tracking-tight text-[#111827]">
                      {me.username}
                    </h1>
                    <div className="mt-2 flex items-center gap-1.5 text-[15px] font-semibold text-[#1d74d2] uppercase">
                      <ShieldCheck className="h-5 w-5" />
                      {me.role}
                    </div>
                  </div>
                </div>
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
                <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                  <div>
                    <div className="text-[11px] font-bold tracking-wider text-[#5f6675]">
                      EMAIL ADDRESS
                    </div>
                    <div className="mt-2 text-sm font-medium text-[#111827] break-all">
                      {me.email || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-wider text-[#5f6675]">
                      PHONE NUMBER
                    </div>
                    <div className="mt-2 text-sm font-medium text-[#111827]">
                      {me.phone || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-wider text-[#5f6675]">
                      AFFILIATIONS
                    </div>
                    <div className="mt-2 text-sm font-medium text-[#111827] break-words">
                      {me.affiliation?.std_name || me.affiliation?.stdName || "N/A"}
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
