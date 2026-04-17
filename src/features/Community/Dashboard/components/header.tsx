import Logo from "@/assets/logo.svg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="flex h-16 w-full items-center justify-between border-b bg-white px-8">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="Logo" className="h-8 w-8" />
                    <span className="text-xl font-bold text-[#0056A0]">Mua He Xanh Online</span>
                </div>
                <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
                    <a href="#" className="text-[#0056A0] underline underline-offset-4">Dashboard</a>
                    <a href="#" className="hover:text-black">My Projects</a>
                    <a href="#" className="hover:text-black">Find Volunteers</a>
                    <a href="#" className="hover:text-black">Impact</a>
                    <a href="#" className="hover:text-black">Resources</a>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <Button className="bg-[#0056A0] hover:bg-[#004480]">Create Project</Button>
                <div className="flex gap-2 text-slate-500">
                    <Bell className="size-5 cursor-pointer hover:text-[#0056A0]" />
                    <Settings className="size-5 cursor-pointer hover:text-[#0056A0]" />
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-1 rounded-full p-1 transition-colors hover:bg-slate-100">
                            <div className="flex size-8 items-center justify-center rounded-full bg-slate-200">
                                <User className="size-5" />
                            </div>
                            <ChevronDown className={`size-4 transition-tranform ${isMenuOpen ? "route-180" : ""}`} />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed insert-0 z-10" onClick={() => setIsMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 z-20 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in duration-200">
                                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        My Account
                                    </div>
                                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                                        <User className="size-4" /> Profile
                                    </button>
                                    <Link to="/logout" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                        <LogOut className="size-4" /> Logout
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export { Header }