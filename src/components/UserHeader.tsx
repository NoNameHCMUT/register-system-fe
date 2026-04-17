import { useState } from "react";
import { User } from "lucide-react";

import { LoginBrand } from "@/features/Login/components/login-brand";

type UserHeaderProps = {
	role?: string;
	onLogout: () => void;
};

const getNavItemsByRole = (role?: string) => {
	if (role === "admin") {
		return ["Campaigns", "List Users", "List Affiliations", "My Profile"];
	}

	return ["Campaigns", "My Profile"];
};

function UserHeader({ role, onLogout }: UserHeaderProps) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const navItems = getNavItemsByRole(role);

	return (
		<header className="sticky top-0 z-50 h-[72px] border-b border-[#e6eaf0] bg-white">
			<div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="origin-left scale-75">
					<LoginBrand />
				</div>

				<nav className="absolute bottom-0 left-1/2 top-0 hidden -translate-x-1/2 space-x-8 md:flex">
					{navItems.map((item, index) => (
						<a
							key={item}
							href="#"
							className={`flex h-full items-center border-b-2 px-2 font-semibold ${
								index === 0
									? "border-[#2890d4] text-[#2890d4]"
									: "border-transparent text-[#2890d4]"
							}`}
						>
							{item}
						</a>
					))}
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
										{role === "admin" ? "Admin Account" : "User Account"}
									</div>
								</div>
							</>
						)}
					</div>

					<button
						type="button"
						onClick={onLogout}
						className="hidden cursor-pointer rounded-xl bg-[#0f4ec6] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b3ea0] md:block"
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
}

export { UserHeader };
