import { Footer } from "@/components/Footer";

import { LoginBrand } from "./components/login-brand";
import { LoginForm } from "./components/login-form";

function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-[#10131a]">
      <header className="border-b border-[#e6eaf0] bg-white/90 backdrop-blur-sm">
        <LoginBrand />
      </header>

      <main className="relative bg-gradient-to-br from-[#2890d4] to-[#00c7d4] flex-1 overflow-hidden px-4 py-6 md:px-8 md:py-10">
        <div className="relative mx-auto flex h-full max-w-[1126px] items-center justify-center">
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export { LoginPage };
