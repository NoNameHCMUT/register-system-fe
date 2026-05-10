import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { GET_USER_QUERY_KEY, useGetUser } from "@/shared/get-user";

type LoginSuccessPayload = {
  access_token?: string;
  refresh_token?: string;
};

type WrappedLoginSuccessPayload = {
  data: LoginSuccessPayload;
};

const unwrapLoginResponse = (
  payload: LoginSuccessPayload | WrappedLoginSuccessPayload,
): LoginSuccessPayload => {
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as WrappedLoginSuccessPayload).data;
  }

  return payload as LoginSuccessPayload;
};

function LoginForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { refetch: refetchMe } = useGetUser(false);

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      const loginData = unwrapLoginResponse(data);
      const accessToken = loginData.access_token;
      const refreshToken = loginData.refresh_token;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      toast.success("Login successful.");

      await queryClient.invalidateQueries({ queryKey: GET_USER_QUERY_KEY });

      try {
        await refetchMe();
        navigate("/");
      } catch (error) {
        handleApiError(error);
      }
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
    <Card className="w-full max-w-[440px] border-[#edf0f5] px-5 py-6 md:px-8 md:py-8">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription className="text-xs">
          Enter your credentials to access the volunteer portal.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5">
        <form
          className="space-y-4"
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
                className="h-[52px] rounded-2xl border-0 bg-[#f3f4f7] pl-12 text-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#8b97ae]"
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
                className="h-[52px] rounded-2xl border-0 bg-[#f3f4f7] pl-12 pr-12 text-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#8b97ae]"
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

          <Button
            type="submit"
            className="h-12 w-full cursor-pointer rounded-xl bg-[#23a0ea] text-[15px] font-medium text-white hover:bg-[#1893df]"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-[15px] text-[#4f5870]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
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
