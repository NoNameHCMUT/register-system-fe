import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { UserHeader } from "@/components/UserHeader";
import { LogIn, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col">
      <UserHeader isPublic />

      <main className="flex flex-1 flex-col items-center justify-center bg-[#2890d4] px-4 py-8 text-center text-white md:px-6 md:py-10">
        <div className="mx-auto flex w-full max-w-[880px] flex-col items-center">
          <div className="relative mb-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-xl md:h-28 md:w-28">
              <div className="flex flex-col items-center text-[#1d9bf0]">
                <Heart className="size-10 fill-current md:size-11" />
                <div className="mt-2 h-1 w-8 rounded-full bg-[#1d9bf0]/20" />
              </div>
            </div>
            <div className="absolute -left-3 -top-3 h-6 w-6 rounded-lg bg-white/20 backdrop-blur-md md:h-7 md:w-7" />
            <div className="absolute -bottom-1 -right-3 h-9 w-8 rounded-lg bg-blue-600/30 md:h-10 md:w-9" />
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-[42px]">
            See you again!
          </h1>

          <p className="max-w-[560px] text-base leading-relaxed opacity-90 md:text-[17px]">
            You have successfully logged out. Thank you for your dedication and
            volunteer spirit in this year's Mua He Xanh campaign.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 md:mt-9">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/login")}
              className="h-11 cursor-pointer rounded-xl border-none bg-white px-6 text-sm font-semibold text-[#1d9bf0] hover:bg-gray-50 md:h-12 md:px-7 md:text-[15px]"
            >
              Log in again <LogIn className="ml-2 size-4 md:size-[18px]" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
