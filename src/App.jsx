import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedPage } from "@/components/ProtectedPage";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EpisodesPage from "./pages/EpisodesPage";
import EpisodeDetailPage from "./pages/EpisodeDetailPage";
import VocabularyPage from "./pages/VocabularyPage";
import ChildrenPage from "./pages/ChildrenPage";
import ChildProfilePage from "./pages/ChildProfilePage";
import SessionsPage from "./pages/SessionsPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import ErrorAnalysisPage from "./pages/ErrorAnalysisPage";
import ReportsPage from "./pages/ReportsPage";
import ContentPage from "./pages/ContentPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import ParentPage from "./pages/ParentPage";
import ParentDetailPage from "./pages/ParentDetailPage";
import SupportPage from "./pages/SupportPages";
import IntrestPage from "./pages/IntrestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/otp-verification" element={<OtpVerificationPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/" element={<ProtectedPage><Index /></ProtectedPage>} />
              <Route path="/category" element={<ProtectedPage><CategoryPage /></ProtectedPage>} />
              <Route path="/episodes" element={<ProtectedPage><EpisodesPage /></ProtectedPage>} />
              <Route path="/episodes/:id" element={<ProtectedPage><EpisodeDetailPage /></ProtectedPage>} />
               <Route path="/parent" element={<ProtectedPage><ParentPage /></ProtectedPage>} />
              <Route path="/parent/:id" element={<ProtectedPage><ParentDetailPage /></ProtectedPage>} />
              <Route path="/vocabulary" element={<ProtectedPage><VocabularyPage /></ProtectedPage>} />
              <Route path="/children" element={<ProtectedPage><ChildrenPage /></ProtectedPage>} />
              <Route path="/children/:id" element={<ProtectedPage><ChildProfilePage /></ProtectedPage>} />
              <Route path="/sessions" element={<ProtectedPage><SessionsPage /></ProtectedPage>} />
              <Route path="/sessions/:id" element={<ProtectedPage><SessionDetailPage /></ProtectedPage>} />
              <Route path="/error-analysis" element={<ProtectedPage><ErrorAnalysisPage /></ProtectedPage>} />
              <Route path="/reports" element={<ProtectedPage><ReportsPage /></ProtectedPage>} />
              <Route path="/content" element={<ProtectedPage><ContentPage /></ProtectedPage>} />
              <Route path="/settings" element={<ProtectedPage><SettingsPage /></ProtectedPage>} />
              <Route path="/support" element={<ProtectedPage><SupportPage /></ProtectedPage>} />
              <Route path="/intreast" element={<ProtectedPage><IntrestPage /></ProtectedPage>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;