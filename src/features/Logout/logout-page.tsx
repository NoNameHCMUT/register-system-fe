import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { LogIn, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className="flex w-full items-center justify-center border-b bg-white py-6">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.svg" alt="Logo" className="h-10 w-10" />
          <span className="text-[32px] font-bold tracking-tight text-[#1e232b]">
            Mua He Xanh Online
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] p-6 text-center text-white">
        
        <div className="relative mb-8">
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-white shadow-xl">
             <div className="flex flex-col items-center text-[#1d9bf0]">
                <Heart className="size-12 fill-current" />
                <div className="mt-2 h-1 w-8 rounded-full bg-[#1d9bf0]/20" />
             </div>
          </div>
          <div className="absolute -top-4 -left-4 h-8 w-8 rounded-lg bg-white/20 backdrop-blur-md" />
          <div className="absolute -bottom-2 -right-4 h-12 w-10 rounded-lg bg-blue-600/30" />
        </div>

        <h1 className="my-7 text-[48px] font-bold tracking-tight">
          See you again!
        </h1>
        
        <p className="my-20 max-w-[600px] text-[18px] leading-relaxed opacity-90">
          You have successfully logged out. Thank you for your dedication 
          and volunteer spirit in this year's Mua He Xanh campaign.
        </p>

        <div className="my-10 flex flex-wrap justify-center gap-4">
         <Button 
            variant="outline"
            type="button"
            onClick={() => navigate("/login")}
            className="h-14 rounded-xl border-none bg-white px-8 text-[16px] font-semibold text-[#1d9bf0] hover:bg-gray-50"
          >
            Log in again <LogIn className="ml-2 size-5" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}