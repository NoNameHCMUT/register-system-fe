// import { UserHeader } from "@/components/UserHeader";
// import { handleLogout, logoutApi } from "@/features/Login/api/logout.api";
// import { Bell, Settings, User, ChevronDown, LogOut } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export function Header() {
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const onLogout = () => {
//     handleLogout();
//     toast.success("Logged out successfully.");
//     navigate("/logout");
//   };
//   return (
//     <>
//       <UserHeader />
 
//       <div className="flex items-center gap-3">
//         <div className="flex items-center gap-3 text-slate-500">
//           <Bell className="size-5 cursor-pointer" />
//           <Settings className="size-5 cursor-pointer" />
//           <div className="relative">
//             <div
//               className="flex items-center gap-1 rounded-full p-1 hover:bg-slate-100 cursor-pointer transition-colors"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//             >
//               <div className="flex size-8 items-center justify-center rounded-full bg-slate-200">
//                 <User className="size-5" />
//               </div>
//               <ChevronDown
//                 className={`size-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
//               />
//             </div>

//             {isMenuOpen && (
//               <>
//                 <div
//                   className="fixed inset-0 z-10"
//                   onClick={() => setIsMenuOpen(false)}
//                 />
//                 <div className="absolute right-0 mt-2 z-20 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in zoom-in duration-200">
//                   <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b mb-1">
//                     My Account
//                   </div>
//                   <button
//                     onClick={onLogout}
//                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                   >
//                     <LogOut className="size-4" />
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
