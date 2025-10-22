import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import RequireLandingPage from "@/components/RequireLandingPage";
import Dashboard from "@/pages/Dashboard";
import Invoices from "@/pages/Invoices";
import LPO from "@/pages/LPO";
import Clients from "@/pages/Clients";
import Payments from "@/pages/Payments";
import Receipts from "@/pages/Receipts";
import Estimates from "@/pages/Estimates";
import Projects from "@/pages/Projects";
import TimeTracking from "@/pages/TimeTracking";
import ExpenseTracker from "@/pages/ExpenseTracker";
import CalendarView from "@/pages/CalendarView";
import Settings from "@/pages/Settings";
import Notes from "@/pages/Notes";
import PrintPreview from "@/pages/PrintPreview";
import Welcome from "@/pages/Welcome";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import LanguageSelector from "@/pages/LanguageSelector";
import NotFound from "@/pages/NotFound";
import VoluntaryContributionPage from "@/pages/VoluntaryContributionPage";
import HomePage from "@/pages/HomePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/language" element={<LanguageSelector />} />
          <Route path="/voluntary-contribution" element={<VoluntaryContributionPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireLandingPage>
                <Dashboard />
              </RequireLandingPage>
            }
          />
          <Route
            path="/invoices"
            element={
              <RequireLandingPage>
                <Invoices />
              </RequireLandingPage>
            }
          />
          <Route
            path="/lpo"
            element={
              <RequireLandingPage>
                <LPO />
              </RequireLandingPage>
            }
          />
          <Route
            path="/clients"
            element={
              <RequireLandingPage>
                <Clients />
              </RequireLandingPage>
            }
          />
          <Route
            path="/payments"
            element={
              <RequireLandingPage>
                <Payments />
              </RequireLandingPage>
            }
          />
          <Route
            path="/receipts"
            element={
              <RequireLandingPage>
                <Receipts />
              </RequireLandingPage>
            }
          />
          <Route
            path="/estimates"
            element={
              <RequireLandingPage>
                <Estimates />
              </RequireLandingPage>
            }
          />
          <Route
            path="/projects"
            element={
              <RequireLandingPage>
                <Projects />
              </RequireLandingPage>
            }
          />
          <Route
            path="/time-tracking"
            element={
              <RequireLandingPage>
                <TimeTracking />
              </RequireLandingPage>
            }
          />
          <Route
            path="/expense-tracker"
            element={
              <RequireLandingPage>
                <ExpenseTracker />
              </RequireLandingPage>
            }
          />
          <Route
            path="/calendar"
            element={
              <RequireLandingPage>
                <CalendarView />
              </RequireLandingPage>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireLandingPage>
                <Settings />
              </RequireLandingPage>
            }
          />
          <Route
            path="/notes"
            element={
              <RequireLandingPage>
                <Notes />
              </RequireLandingPage>
            }
          />
          <Route
            path="/print-preview/:invoiceId"
            element={
              <RequireLandingPage>
                <PrintPreview />
              </RequireLandingPage>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
