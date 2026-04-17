import { Footer } from "@/components/Footer";
import { CreateForm } from "./components/create-form";
import { CommunityStats } from "./components/community-stats";
import { UserHeader } from "@/components/UserHeader";
import { handleLogout } from "@/features/Login/api/logout.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "@/shared/get-user";

export default function CommunityDashboard() {
  const navigate = useNavigate();
  const { data: me } = useGetUser();

  const onLogout = () => {
    handleLogout();
    toast.success("Logged out successfully.");
    navigate("/logout");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <UserHeader role={me?.role} onLogout={onLogout} />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#0047AB] md:text-[34px]">
              Welcome back, Local Community
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500 md:text-base">
              Start managing volunteer activities and creating positive impacts
              for the community today
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Stats */}
          <CommunityStats />

          {/* Right Content: Create Project Form */}
          <CreateForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
