import { Toaster } from "sonner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "./features/Register/Register";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        richColors
        position="top-center"
        // expand={true}
        // toastOptions={{
        //   style: {
        //     minWidth: "360px",
        //     fontSize: "16px",
        //     padding: "16px",
        //   },
        // }}
      />

      <Routes>
        <Route path="/" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
