/* eslint-disable no-unused-vars */
import { Alert } from "@mui/material";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useUserContext } from "../hooks/Usercontext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "sonner";
import logo from "../assets/loginFormImages/Bookify (200 x 200 px) (Website) (2).svg";
import { authAPI } from "../services/api";

const SignupPage = () => {
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [signUpError, setSignUpError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [{ user }, dispatch] = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSignUpError(null);

    try {
      const data = await authAPI.signup(userDetails);

      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "SET_USER", payload: data });
      toast.success("Account created successfully! Welcome to Bookify!");
      setRedirect(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Signup failed. Please try again.";

      setSignUpError(errorMessage);

      if (errorMessage.includes("Password")) {
        toast.error(
          "Strong passwords are at least 8 characters long and include uppercase, lowercase, number, and special character.",
          { duration: 7000 }
        );
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  if (redirect || user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gray-50 grid place-items-center min-h-screen font-mulish px-4 py-20">
      <div className="bg-white flex flex-col gap-y-6 lg:w-5/12 md:w-1/2 w-full max-w-md p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col justify-center items-center gap-3">
          <Link to="/">
            <img
              src={logo}
              alt="Bookify Logo"
              className="h-12 w-32 object-contain"
            />
          </Link>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Create account</h2>
            <p className="text-sm text-gray-600 mt-1">Start your journey with Bookify</p>
          </div>
        </div>

        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          <div className="flex w-full gap-3">
            <label htmlFor="first_name" className="flex flex-col gap-1.5 w-full">
              <span className="text-sm font-medium text-gray-700">First Name</span>
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="John"
                value={userDetails.first_name}
                onChange={handleChange}
                required
                className="border border-gray-200 outline-none text-gray-900 h-11 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder:text-gray-400"
              />
            </label>

            <label htmlFor="last_name" className="flex flex-col gap-1.5 w-full">
              <span className="text-sm font-medium text-gray-700">Last Name</span>
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Doe"
                value={userDetails.last_name}
                onChange={handleChange}
                required
                className="border border-gray-200 outline-none text-gray-900 h-11 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder:text-gray-400"
              />
            </label>
          </div>

          <label htmlFor="email" className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={userDetails.email}
              onChange={handleChange}
              required
              className="border border-gray-200 outline-none text-gray-900 h-11 px-4 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder:text-gray-400"
            />
          </label>

          <label htmlFor="password" className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={userDetails.password}
                onChange={handleChange}
                required
                className="border border-gray-200 outline-none text-gray-900 h-11 px-4 pr-12 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <VisibilityOff sx={{ fontSize: '20px' }} />
                ) : (
                  <Visibility sx={{ fontSize: '20px' }} />
                )}
              </button>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              At least 8 characters with uppercase, lowercase, number, and special character
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 rounded-lg py-2.5 shadow-sm text-white font-medium text-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {signUpError && (
          <Alert severity="error" className="rounded-lg">
            {signUpError}
          </Alert>
        )}

        <div className="text-center text-sm text-gray-600">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-orange-600 hover:text-orange-700 font-medium transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
