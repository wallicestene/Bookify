/* eslint-disable no-unused-vars */
import { Menu, LogOut, User, LayoutDashboard } from "lucide-react";
import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import NavbarMobile from "./NavbarMobile";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/Usercontext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import logo from "../assets/loginFormImages/Bookify (200 x 200 px) (Website) (2).svg";
import { toast } from "sonner";

const Navbar = () => {
  const [showNavMobile, setShowNavMobile] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [{ user }, dispatch] = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const navShow = () => {
      if (window.scrollY > 10) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener("scroll", navShow);

    return () => window.removeEventListener("scroll", navShow);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT_USER" });
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div
      className={`fixed z-20 bg-white flex items-center justify-between py-2 font-mulish w-full px-4 transition-all duration-300 ${
        showNavbar &&
        "backdrop-blur-xl bg-white/60 shadow-md"
      }`}
    >
      <div className="left text-lg font-bold font-Montserrat flex items-center">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img
            src={logo}
            alt="Bookify Logo"
            className="h-14 w-36 object-center object-contain rounded-md"
          />
        </Link>
      </div>

      {showNavMobile && (
        <div className="lg:hidden md:hidden fixed z-20 bg-totem-pole-700 text-totem-pole-50 top-16 right-0 h-screen w-2/5 shadow-xl">
          <NavbarMobile />
        </div>
      )}

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex gap-2 items-center justify-between lg:border md:border border-slate-300 hover:border-slate-400 rounded-full overflow-hidden text-slate-900 hover:bg-slate-50 transition px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <span className="hidden lg:flex md:flex text-sm font-medium capitalize">
                {user?.first_name}
              </span>
              <Avatar
                sx={{ width: 33, height: 33, backgroundColor: "#0F172A" }}
              >
                {user?.first_name?.[0]?.toUpperCase()}
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/account"
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/account/myListings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          to="/login"
          className="flex gap-2 items-center justify-between lg:border md:border border-slate-300 hover:border-slate-400 rounded-full overflow-hidden text-slate-900 hover:bg-slate-50 transition px-4 py-2"
        >
          <span className="hidden lg:flex md:flex text-sm font-medium">
            Log In
          </span>
          <Avatar sx={{ width: 33, height: 33, backgroundColor: "#0F172A" }}>
            <User size={18} />
          </Avatar>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
