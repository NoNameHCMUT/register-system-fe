import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AcceptPage } from "./features/Admin/accept/accept-page";
import { AffiliationsPage } from "./features/Admin/affiliations/affiliations-page";
import { CommunityHome } from "./features/Community/CommunityHome";
import { LoginPage } from "./features/Login/login-page";
import { queryClient } from "./shared/query-client";
import LogoutPage from "./features/Logout/logout-page";
import RegisterPage from "./features/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          richColors
          position="top-center"
          expand={true}
          toastOptions={{
            style: {
              minWidth: "360px",
              fontSize: "16px",
              padding: "16px",
            },
          }}
        />

        <Routes>
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/" element={<ProtectedRoute />} />
          <Route
            path="/community/campaigns"
            element={
              <ProtectedRoute>
                <CommunityHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/affiliations"
            element={
              <ProtectedRoute>
                <AffiliationsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/accept" element={<AcceptPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
