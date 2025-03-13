// import React from "react";
import HomePage from "./pages/HomePage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import Layout from "./layouts/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import AccountPage from "./pages/AccountPage";
import Profile from "./pages/Profile";
import { toast, Toaster } from "sonner";
import { useUserContext } from "./hooks/Usercontext";
import { useEffect } from "react";
import PropertiesPage from "./pages/PropertiesPage";
import PlacesForm from "./pages/PlacesForm";
import MyBookings from "./pages/MyBookings";
import ImageGallery from "./components/ImageGallery";
import { jwtDecode } from "jwt-decode";
import DashboardLayout from "./pages/DashboardLayout";
const App = () => {
  const [, dispatch] = useUserContext();
  // updating the auth state
  useEffect(() => {
    const updateAuthState = () => {
      const userFromStorage = localStorage.getItem("user");
      const loggedUser = userFromStorage ? JSON.parse(userFromStorage) : null;
      if (loggedUser) {
        const isTokenExpired =
          jwtDecode(loggedUser?.token).exp * 1000 < Date.now();

        if (isTokenExpired) {
          // Notify the logged-in user about the session expiration
          toast("Your session has expired. Please log in again.");
          // Remove the user from local storage
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT_USER" });
          return;
        }

        // User has a valid token
        dispatch({ type: "SET_USER", payload: loggedUser });
      } else {
        // No logged-in user; assume visitor
        dispatch({ type: "LOGOUT_USER" });
      }
    };
    updateAuthState();
  }, [dispatch]);
  return (
    <Router>
      <Toaster position="top-left" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<HomePage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/account" element={<DashboardLayout />} />
          {/* <Route path="/account/myListings" element={<PropertiesPage />} />
          <Route path="/account/myBookings" element={<MyBookings />} /> */}
          <Route path="/account/myProperties/new" element={<PlacesForm />} />
          <Route path="/account/myProperties/:id" element={<PlacesForm />} />
          <Route path="/imageGallery/:id" element={<ImageGallery />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
