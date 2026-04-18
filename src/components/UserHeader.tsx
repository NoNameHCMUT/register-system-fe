import { useState } from "react";
import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { LoginBrand } from "@/features/Login/components/login-brand";

type UserHeaderProps = {
  isPublic?: boolean;
  role?: string;
  onLogout?: () => void;
};

type NavItem = {
  label: string;
  to?: string;
};

const getNavItemsByRole = (role?: string): NavItem[] => {
    return [
      { label: "Campaigns", to: "/" },
      { label: "List Users", to: "/admin/accept" },
      { label: "List Affiliations", to: "/admin/affiliations" },
      { label: "My Profile" },
    ];
  }

//   if (role === "community") {
//     return [
//       { label: "Dashboard", to: "/" },
//       { label: "My Campaigns", to: "/community/campaigns" },
//       { label: "My Profile" },
//     ];
//   }

//   return [
//     { label: "Campaigns", to: "/" },
//     { label: "My Profile" },
//   ];
// };

function UserHeader({ isPublic = false, role, onLogout }: UserHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navItems = getNavItemsByRole(role);

  if (isPublic) {
    return (
      <header className="border-b border-[#e6eaf0] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full items-center justify-center">
          <LoginBrand />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-[#e6eaf0] bg-white">
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="origin-left scale-75">
          <LoginBrand />
        </div>

        <nav className="absolute bottom-0 left-1/2 top-0 hidden -translate-x-1/2 space-x-8 md:flex">
          {navItems.map((item, index) => {
            const isActive = item.to
              ? location.pathname === item.to ||
                (item.to === "/" && location.pathname === "/")
              : false;

            const className = `flex h-full items-center border-b-2 px-2 font-semibold ${
              isActive || (!item.to && index === 0)
                ? "border-[#2890d4] text-[#2890d4]"
                : "border-transparent text-[#2890d4]"
            }`;

            if (!item.to) {
              return (
                <span key={item.label} className={className}>
                  {item.label}
                </span>
              );
            }

            return (
              <Link key={item.label} to={item.to} className={className}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-[#3f4b5f]">
          <div className="relative">
            <button
              className="rounded-full p-1.5 hover:bg-[#e5e9f0]"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              <User size={16} />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-[#d8dde6] bg-white py-1 shadow-lg">
                  <div className="border-b border-[#edf1f6] px-4 py-2 text-sm font-medium text-[#3c4658]">
                    {role === "admin"
                      ? "Admin Account"
                      : role === "community"
                        ? "Community Account"
                        : "User Account"}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="hidden cursor-pointer rounded-xl bg-[#0f4ec6] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b3ea0] md:block"
            disabled={!onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export { UserHeader };
