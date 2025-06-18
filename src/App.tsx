
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BasicCalculator from "./pages/BasicCalculator";
import AdvancedCalculator from "./pages/AdvancedCalculator";
import Results from "./pages/Results";
import CalculosSalvos from "./pages/CalculosSalvos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div 
        className="dark min-h-screen" 
        style={{ 
          background: 'var(--bg-primary, #1a1a1a)',
          color: 'var(--text-primary, rgba(255, 255, 255, 0.95))',
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(133, 149, 171, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(164, 176, 192, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(194, 202, 213, 0.06) 0%, transparent 50%)
          `
        }}
      >
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculadora-basica" element={<BasicCalculator />} />
            <Route path="/calculadora-avancada" element={<AdvancedCalculator />} />
            <Route path="/resultados" element={<Results />} />
            <Route path="/calculos-salvos" element={<CalculosSalvos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
