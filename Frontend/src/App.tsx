import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudyRoomPage from "./pages/StudyRoomPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./pages/DashboardLayout";
import RoomDetailPage from "./pages/RoomDetailPage";
import DashboardHome from "./pages/DashboardHome";
import LearningStylePage from "./pages/LearningStylePage";
import SummarizerPage from "./pages/SummarizerPage";
import CareerPage from "./pages/CareerPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ContinueQuizPage from "./pages/ContinueQuizPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="learning-style" element={<LearningStylePage />} />
              <Route path="summarizer" element={<SummarizerPage />} />
              <Route path="career" element={<CareerPage />} />
              <Route path="continue-quiz" element={<ContinueQuizPage />} />
              <Route path="flashcards" element={<FlashcardsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="/dashboard/room/:code" element={<RoomDetailPage />} />

              <Route path="/dashboard/study-room" element={<StudyRoomPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>

        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
