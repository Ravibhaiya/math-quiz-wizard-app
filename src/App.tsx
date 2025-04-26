
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "@/hooks/useQuizContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdditionSettingsPage from "./pages/addition/AdditionSettingsPage";
import SubtractionSettingsPage from "./pages/subtraction/SubtractionSettingsPage";
import MultiplicationSettingsPage from "./pages/multiplication/MultiplicationSettingsPage";
import DivisionSettingsPage from "./pages/division/DivisionSettingsPage";
import QuizPage from "./pages/quiz/QuizPage";
import ResultsPage from "./pages/results/ResultsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <QuizProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/addition/settings" element={<AdditionSettingsPage />} />
            <Route path="/subtraction/settings" element={<SubtractionSettingsPage />} />
            <Route path="/multiplication/settings" element={<MultiplicationSettingsPage />} />
            <Route path="/division/settings" element={<DivisionSettingsPage />} />
            <Route path="/quiz/:type" element={<QuizPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QuizProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
