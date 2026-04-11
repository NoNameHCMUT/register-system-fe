import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { handleApiError } from "@/shared/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginApi } from "../api/login.api";
import { isEmpty } from "../utils";

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      toast.success("Login successful.");
      navigate("/");
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  const handleSubmit = () => {
    if (isEmpty(username) || isEmpty(password)) {
      toast.error("Please fill in both username and password.");
      return;
    }

    loginMutation.mutate({ username, password });
  };

  return (
    <Card className="w-full max-w-[500px] border-[#edf0f5] px-6 py-8 md:px-10 md:py-10">
      <CardHeader className="gap-3">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access the volunteer portal.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-7">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="username">username</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aeb5c5]" />
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                className="h-[60px] rounded-2xl border-0 bg-[#f3f4f7] pl-12 text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#8b97ae]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#aeb5c5]" />
              <Input
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-[60px] rounded-2xl border-0 bg-[#f3f4f7] pl-12 pr-12 text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#8b97ae]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((currentValue) => !currentValue)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#23a5f5] transition-opacity hover:opacity-80"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-[15px] font-medium text-[#1d9bf0] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            className="h-14 w-full rounded-xl cursor-pointer bg-[#23a0ea] text-[16px] font-medium text-white hover:bg-[#1893df]"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-[15px] text-[#4f5870]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="font-semibold text-[#1d9bf0] hover:underline"
            >
              Sign up
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export { LoginForm };
