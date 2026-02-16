import { useEffect } from "react";
import BookingDashboard from "./layout/dashboard-layout";
import { useAuthStore } from "./stores/auth.store";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import ProfilePage from "./pages/profile";
import CookieConsent from "./components/cookie-consent";
import { ThemeProvider } from "./dark-mode";
import { ModeToggle } from "./components/toggle";

const PUBLIC_ROUTES = ["/login", "/signup", "/register"];

function App() {
  const initialise = useAuthStore((state) => state.initialise);
  const navigate = useNavigate();
  const location = useLocation();

  const checkAuth = async () => {
    if (PUBLIC_ROUTES.includes(location.pathname)) return;
    const success = await initialise();
    console.log(success);
    if (!success) {
      navigate("/login");
      return;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="w-full">
      <ThemeProvider>
        <CookieConsent />
        <Routes>
          <Route path="/" element={<BookingDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <ModeToggle className="fixed bottom-4 right-4 p-2 bg-background border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-colors" />
      </ThemeProvider>
    </div>
  );
}

export default App;
