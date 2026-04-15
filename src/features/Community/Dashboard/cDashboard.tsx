import { Footer } from "@/components/Footer";
import { Header } from "./components/header";
import { CreateForm } from "./components/create-form";
import { SideBar } from "./components/sidebard";

export default function CommunityDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <Header />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[1400px] flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#0047AB]">Welcome back, Local Community</h1>
            <p className="mt-2 text-slate-500">Start managing volunteer activities and creating positive impacts for the community today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sidebar Stats */}
          <SideBar />

          {/* Right Content: Create Project Form */}
          <CreateForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}