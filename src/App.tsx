import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import { DiagnosticoProvider } from "./contexts/DiagnosticoContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import ValidationPanel from "./components/dev/ValidationPanel";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Results = lazy(() => import("./pages/Results"));
const CalculosSalvos = lazy(() => import("./pages/CalculosSalvos"));
const Login = lazy(() => import("./pages/Login"));
const DefinirSenha = lazy(() => import("./pages/DefinirSenha"));
const RecuperarSenha = lazy(() => import("./pages/RecuperarSenha"));
const RedefinirSenha = lazy(() => import("./pages/RedefinirSenha"));
const SolicitarAtivacao = lazy(() => import("./pages/SolicitarAtivacao"));
const AcessoNegado = lazy(() => import("./pages/AcessoNegado"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuditoriaITCMDPage = lazy(() => import("./pages/AuditoriaITCMD"));
const ReenviarAtivacao = lazy(() => import("./pages/Admin/ReenviarAtivacao"));
const Diagnostico = lazy(() => import("./pages/Diagnostico"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DiagnosticoProvider>
            <div 
              className="light min-h-screen bg-animated"
              style={{ 
                backgroundColor: '#F5EFEB',
                color: '#2C2C2C',
                minHeight: '100vh'
              }}
            >
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Rotas públicas */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/definir-senha" element={<DefinirSenha />} />
                    <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                    <Route path="/redefinir-senha" element={<RedefinirSenha />} />
                    <Route path="/solicitar-ativacao" element={<SolicitarAtivacao />} />
                    <Route path="/acesso-negado" element={<AcessoNegado />} />
                    
                    {/* Rotas protegidas */}
                    <Route path="/diagnostico" element={
                      <ProtectedRoute>
                        <Diagnostico />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    } />
                    <Route path="/resultados" element={
                      <ProtectedRoute>
                        <Results />
                      </ProtectedRoute>
                    } />
                    <Route path="/calculos-salvos" element={
                      <ProtectedRoute>
                        <CalculosSalvos />
                      </ProtectedRoute>
                    } />
                    <Route path="/auditoria-itcmd" element={
                      <ProtectedRoute>
                        <AuditoriaITCMDPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/reenviar-ativacao" element={
                      <ProtectedRoute>
                        <ReenviarAtivacao />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                {/* ValidationPanel only shown in development for authenticated users */}
                {process.env.NODE_ENV === 'development' && <ValidationPanel />}
              </BrowserRouter>
            </div>
          </DiagnosticoProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
