import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import { LoginBrand } from "../Login/components/login-brand";
import { Eye, EyeOff } from "lucide-react";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { handleApiError } from "@/shared/api";

import { registerApi } from "./api/register.api";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "community", label: "Local Community" },
  { value: "representative", label: "School Representative" },
];

const schoolOptions = [
  { value: "hcmut", label: "Ho Chi Minh University of Technology" },
  { value: "hcmus", label: "Ho Chi Minh City University of Science" },
  {
    value: "hcmussh",
    label: "Ho Chi Minh City University of Social Sciences and Humanities",
  },
];

const cityOptions = [
  { value: "hcm", label: "Ho Chi Minh" },
  { value: "hn", label: "Ha Noi" },
  { value: "hp", label: "Hai Phong" },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [school, setSchool] = useState("");
  const [city, setCity] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      toast.success(data.message || "Register successful.");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const handleSubmit = () => {
    if (
      !username.trim() ||
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !role ||
      !school ||
      !city
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Confirm password does not match.");
      return;
    }

    registerMutation.mutate({
      username,
      fullName,
      email,
      password,
      confirmPassword,
      role,
      school,
      city,
    });
  };

  return (
    <div className="flex min-h-svh flex-col bg-white text-[#10131a]">
      <header className="border-b border-[#e6eaf0] bg-white/90 backdrop-blur-sm">
        <LoginBrand />
      </header>

      <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-[#2890d4] to-[#00c7d4] px-4 py-6 md:px-8 md:py-10">
        <div className="relative mx-auto flex h-full w-full max-w-[1126px] items-center justify-center">
          <Card className="w-full max-w-[580px] border-none p-4 shadow-sm md:p-8">
            <CardHeader className="space-y-1 px-0 pb-8 text-left">
              <CardTitle className="text-[32px] font-bold">
                Create account
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1d9bf0] outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-gray-500" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswordAgain ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Enter your password again"
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordAgain(!showPasswordAgain)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1d9bf0] outline-none"
                    >
                      {showPasswordAgain ? (
                        <EyeOff className="size-5 text-gray-500" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="choose-your-role">Choose Your Role</Label>
                  <Select
                    id="role"
                    value={role}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setRole(event.target.value)
                    }
                    options={roleOptions}
                    placeholder="Select one"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">School</Label>
                  <Select
                    id="school"
                    value={school}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setSchool(event.target.value)
                    }
                    options={schoolOptions}
                    placeholder="Select one"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    id="city"
                    value={city}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setCity(event.target.value)
                    }
                    options={cityOptions}
                    placeholder="Select one"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-12 rounded-xl bg-[#1d9bf0] text-[16px] font-semibold hover:bg-[#1a8cd8]"
                >
                  {registerMutation.isPending ? "Signing up..." : "Sign up"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
