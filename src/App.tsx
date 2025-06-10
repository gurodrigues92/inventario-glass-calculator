
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculadora-basica" element={<BasicCalculator />} />
          <Route path="/calculadora-avancada" element={<AdvancedCalculator />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="/calculos-salvos" element={<CalculosSalvos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
