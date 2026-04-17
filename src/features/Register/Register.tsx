import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import { LoginBrand } from "../Login/components/login-brand";
import { Eye, EyeOff } from "lucide-react";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { handleApiError } from "@/shared/api";

import { getAffiliationsApi, registerApi } from "./api/register.api";

const roleOptions = [
  { value: "student", label: "Student" },
  { value: "community", label: "Local Community" },
  { value: "representative", label: "School Representative" },
];

type RegisterFormErrors = {
  username?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  affiliation?: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});

  const affiliationsQuery = useQuery({
    queryKey: ["affiliations"],
    queryFn: getAffiliationsApi,
  });

  const affiliationOptions = (affiliationsQuery.data ?? []).map((item) => ({
    value: String(item.id),
    label: item.std_name,
  }));

  const clearFieldError = (field: keyof RegisterFormErrors) => {
    setFormErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      toast.success(data.message || "Register successful.");
      navigate("/login");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const handleSubmit = () => {
    const nextErrors: RegisterFormErrors = {};

    if (!username.trim()) {
      nextErrors.username = "Please enter your username";
    }

    if (!fullName.trim()) {
      nextErrors.fullName = "Please enter your full name";
    }

    if (!email.trim()) {
      nextErrors.email = "Please enter your email";
    }

    if (!phone.trim()) {
      nextErrors.phone = "Please enter your phone number";
    }

    if (!password.trim()) {
      nextErrors.password = "Please enter your password";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be greater than 5";
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Confirm password does not match";
    }

    if (!role) {
      nextErrors.role = "Please select your role";
    }

    if (!affiliation) {
      nextErrors.affiliation = "Please select your affiliation";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const affiliationId = Number(affiliation);
    if (Number.isNaN(affiliationId)) {
      setFormErrors((prev) => ({
        ...prev,
        affiliation: "Please select a valid affiliation",
      }));
      return;
    }

    setFormErrors({});

    registerMutation.mutate({
      username,
      fullName,
      email,
      password,
      confirmPassword,
      role,
      affiliationId,
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
                    onChange={(event) => {
                      setUsername(event.target.value);
                      clearFieldError("username");
                    }}
                    placeholder="Enter your username"
                  />
                  {formErrors.username && (
                    <p className="text-sm text-red-600">{formErrors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    value={fullName}
                    onChange={(event) => {
                      setFullName(event.target.value);
                      clearFieldError("fullName");
                    }}
                    placeholder="Enter your full name"
                  />
                  {formErrors.fullName && (
                    <p className="text-sm text-red-600">{formErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearFieldError("email");
                    }}
                    placeholder="Enter your email"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="phone"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      clearFieldError("phone");
                    }}
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        clearFieldError("password");
                      }}
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
                  {formErrors.password && (
                    <p className="text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswordAgain ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        clearFieldError("confirmPassword");
                      }}
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
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="choose-your-role">Choose Your Role</Label>
                  <Select
                    id="role"
                    value={role}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      const selectedRole = event.target.value;
                      setRole(selectedRole);
                      setAffiliation("");
                      clearFieldError("role");
                      clearFieldError("affiliation");
                    }}
                    options={roleOptions}
                    placeholder="Select one"
                  />
                  {formErrors.role && (
                    <p className="text-sm text-red-600">{formErrors.role}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliation_id">Affiliation</Label>
                  <Select
                    id="affiliation_id"
                    value={affiliation}
                    disabled={
                      affiliationsQuery.isLoading ||
                      affiliationOptions.length === 0
                    }
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      {
                        setAffiliation(event.target.value);
                        clearFieldError("affiliation");
                      }
                    }
                    options={affiliationOptions}
                    placeholder={
                      affiliationsQuery.isLoading
                        ? "Loading affiliations..."
                        : "Select one"
                    }
                  />
                  {formErrors.affiliation && (
                    <p className="text-sm text-red-600">{formErrors.affiliation}</p>
                  )}
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
