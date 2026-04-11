import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./features/Login/login-page";
import { queryClient } from "./shared/query-client";
import RegisterPage from "./features/Register/Register";

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
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
