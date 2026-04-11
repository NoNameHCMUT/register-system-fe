import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./features/Login/login-page";
import { StudentHome } from "./features/StudentHome";
import { queryClient } from "./shared/query-client";

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
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="*" element={<Navigate to="/student-home" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
