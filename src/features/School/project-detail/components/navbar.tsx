import Logo from "@/assets/logo.svg";
import { logoutApi } from "@/features/Login/api/logout.api";
import { handleApiError } from "@/shared/api";
import { useMutation } from "@tanstack/react-query";
import { Bell, Settings, User, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Header() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutMutation = useMutation({
        mutationFn: logoutApi,
        onSuccess: (data) => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            toast.success(data.message || "Logged out successfully.");
            navigate("/login");
        },
        onError: (error) => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            handleApiError(error);
            navigate("/login");
        },
    });

    return (
        <header className="flex h-16 w-full items-center justify-between border-b bg-white px-8">
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-[#0056A0]">Mua He Xanh Online</span>
            </div>
            <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#" className="text-[#0056A0] underline underline-offset-4">Dashboard</a>
            {/* <a href="#" className="hover:text-black">My Projects</a>
            <a href="#" className="hover:text-black">Find Volunteers</a>
            <a href="#" className="hover:text-black">Impact</a>
            <a href="#" className="hover:text-black">Resources</a> */}
            </nav>
        </div>

        <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-slate-500">
                <Bell className="size-5 cursor-pointer" />
                <Settings className="size-5 cursor-pointer" />
                <div className="relative">
            <div 
                className="flex items-center gap-1 rounded-full p-1 hover:bg-slate-100 cursor-pointer transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                <div className="flex size-8 items-center justify-center rounded-full bg-slate-200">
                    <User className="size-5" />
                </div>
                <ChevronDown className={`size-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                </div>

                {isMenuOpen && (
                <>
                    <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 z-20 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in duration-200">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b mb-1">
                        My Account
                    </div>
                    <button 
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="size-4" /> 
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </button>
                    </div>
                </>
                )}
            </div>
            </div>
        </div>
    </header>
  );
}