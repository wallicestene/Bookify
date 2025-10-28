import { lazy, Suspense, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useUserContext } from "./hooks/Usercontext";
import Layout from "./layouts/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const PropertyDetailsPage = lazy(() => import("./pages/PropertyDetailsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const Profile = lazy(() => import("./pages/Profile"));
const PropertiesPage = lazy(() => import("./pages/PropertiesPage"));
const PlacesForm = lazy(() => import("./pages/PlacesForm"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const ImageGallery = lazy(() => import("./components/ImageGallery"));
const DashboardLayout = lazy(() => import("./pages/DashboardLayout"));
const Analytics = lazy(() => import("./pages/Analytics"));

const App = () => {
  const [, dispatch] = useUserContext();

  // Update auth state on mount
  useEffect(() => {
    const updateAuthState = () => {
      const userFromStorage = localStorage.getItem("user");
      const loggedUser = userFromStorage ? JSON.parse(userFromStorage) : null;

      if (loggedUser) {
        const isTokenExpired =
          jwtDecode(loggedUser?.token).exp * 1000 < Date.now();

        if (isTokenExpired) {
          toast("Your session has expired. Please log in again.");
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT_USER" });
          return;
        }

        dispatch({ type: "SET_USER", payload: loggedUser });
      } else {
        dispatch({ type: "LOGOUT_USER" });
      }
    };

    updateAuthState();
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Router>
        <Toaster position="top-right" richColors expand={false} />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Dashboard routes */}
              <Route path="/account" element={<DashboardLayout />}>
                <Route index element={<Profile />} />
                <Route path="myListings" element={<PropertiesPage />} />
                <Route path="myBookings" element={<MyBookings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="myProperties/new" element={<PlacesForm />} />
                <Route path="myProperties/:id" element={<PlacesForm />} />
              </Route>

              <Route path="/imageGallery/:id" element={<ImageGallery />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
