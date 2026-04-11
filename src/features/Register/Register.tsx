import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react";
import { Select } from "@/components/ui/select";
import { useState } from "react";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "community", label: "Local Community" },
  { value: "representative", label: "School Representative" },
];

const schoolOptions = [
  { value: "hcmut", label: "Ho Chi Minh University of Technology" },
  { value: "hcmus", label: "Ho Chi Minh City University of Science" },
  { value: "hcmussh", label: "Ho Chi Minh City University of Social Sciences and Humanities" },
];

const cityOptions = [
  { value: "hcm", label: "Ho Chi Minh" },
  { value: "hn", label: "Ha Noi" },
  { value: "hp", label: "Hai Phong" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  
  return (
    <div className="flex min-h-screen flex-col bg-[#f0f2f5]">
      <header className="flex w-full items-center justify-center border-b bg-white py-6">
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.svg" alt="Logo" className="h-10 w-10" />
          <span className="text-[32px] font-bold tracking-tight text-[#1e232b]">
            Mua He Xanh
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-[580px] border-none p-4 shadow-sm md:p-8">
          <CardHeader className="space-y-1 px-0 pb-8 text-left">
            <CardTitle className="text-[32px] font-bold">Create account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-0">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input id="fullname" placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pr-12"/>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1d9bf0] outline-none">
                  {showPassword ? <EyeOff className="size-5 text-gray-500" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
              <Input id="password" type={showPasswordAgain ? "text" : "password"} placeholder="Enter your password" className="pr-12"/>
                <button 
                  type="button"
                  onClick={() => setShowPasswordAgain(!showPasswordAgain)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1d9bf0] outline-none">
                  {showPasswordAgain ? <EyeOff className="size-5 text-gray-500" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="choose-your-role">Choose Your Role</Label>
              <Select id="role" options={roleOptions} placeholder="Select one" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Select id="school" options={schoolOptions} placeholder="Select one" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select id="city" options={cityOptions} placeholder="Select one" />
            </div>

            <Button className="w-full h-12 rounded-xl bg-[#1d9bf0] text-[16px] font-semibold hover:bg-[#1a8cd8]">
              Sign up
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}