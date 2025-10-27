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
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 grid place-items-center min-h-screen font-mulish text-sm px-4 py-6">
      <div className="bg-white flex flex-col gap-y-4 lg:w-5/12 md:w-1/2 w-full lg:p-6 md:px-4 px-4 py-6 rounded-lg shadow-xl">
        <div className="flex flex-col justify-center items-center text-[1.5rem] font-semibold">
          <Link to="/">
            <img
              src={logo}
              alt="Bookify Logo"
              className="h-14 w-36 object-center object-contain rounded-md"
            />
          </Link>
          <h2>
            Welcome to <span className="text-totem-pole-600">Bookify</span>
          </h2>
        </div>

        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          <div className="flex w-full gap-3">
            <label htmlFor="first_name" className="flex flex-col gap-1 w-full">
              <span className="font-medium">First Name</span>
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="Enter first name"
                value={userDetails.first_name}
                onChange={handleChange}
                required
                className="border outline-none text-slate-950 shadow-md h-12 px-4 rounded-md focus:ring-2 focus:ring-orange-500 transition"
              />
            </label>

            <label htmlFor="last_name" className="flex flex-col gap-1 w-full">
              <span className="font-medium">Last Name</span>
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Enter last name"
                value={userDetails.last_name}
                onChange={handleChange}
                required
                className="border outline-none text-slate-950 shadow-md h-12 px-4 rounded-md focus:ring-2 focus:ring-orange-500 transition"
              />
            </label>
          </div>

          <label htmlFor="email" className="flex flex-col gap-1">
            <span className="font-medium">Email</span>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={userDetails.email}
              onChange={handleChange}
              required
              className="border outline-none text-slate-950 shadow-md h-12 px-4 rounded-md focus:ring-2 focus:ring-orange-500 transition"
            />
          </label>

          <label htmlFor="password" className="flex flex-col gap-1">
            <span className="font-medium">Password</span>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={userDetails.password}
                onChange={handleChange}
                required
                className="border outline-none text-slate-950 shadow-md h-12 px-4 pr-12 rounded-md w-full focus:ring-2 focus:ring-orange-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </button>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              At least 8 characters with uppercase, lowercase, number, and
              special character
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-l from-rose-400 via-fuchsia-500 to-indigo-500 rounded-md py-3 shadow-lg text-white font-semibold tracking-wide text-[1rem] hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {signUpError && (
          <Alert variant="filled" severity="error">
            {signUpError}
          </Alert>
        )}

        <div className="text-center text-xs">
          <span>Already Registered? </span>
          <Link
            to="/login"
            className="underline text-blue-800 hover:text-blue-600"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
