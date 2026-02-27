import { lazy, Suspense } from 'react';
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";

// Lazy load protected pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Parcelamentos = lazy(() => import('./pages/Parcelamentos'));
const Assinaturas = lazy(() => import('./pages/Assinaturas'));
const Categorias = lazy(() => import('./pages/Categorias'));
const Configuracoes = lazy(() => import('./pages/Configuracoes'));

const queryClient = new QueryClient();

// Page loader component
function PageLoader() {
  return (
    <div className="space-y-8 p-4">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route
                  path="/dashboard"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Dashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="/parcelamentos"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Parcelamentos />
                    </Suspense>
                  }
                />
                <Route
                  path="/assinaturas"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Assinaturas />
                    </Suspense>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Categorias />
                    </Suspense>
                  }
                />
                <Route
                  path="/configuracoes"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Configuracoes />
                    </Suspense>
                  }
                />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
