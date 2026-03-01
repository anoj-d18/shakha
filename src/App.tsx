import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/lib/lang";
import Index from "./pages/Index";
import RegisterPage from "./pages/RegisterPage";
import AttendancePage from "./pages/AttendancePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LangProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
