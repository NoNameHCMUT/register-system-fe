import { Footer } from "@/components/Footer";
import { UserHeader } from "@/components/UserHeader";

import { LoginForm } from "./components/login-form";

function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-[#10131a]">
      <UserHeader isPublic />

      <main className="relative flex-1 overflow-hidden bg-[#2890d4] px-4 py-8 md:px-6 md:py-10">
        <div className="relative mx-auto flex h-full w-full max-w-[900px] items-center justify-center">
          <LoginForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export { LoginPage };
