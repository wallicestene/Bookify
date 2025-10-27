import { useUserContext } from "./Usercontext";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useAuth = () => {
  const [{ user }, dispatch] = useUserContext();
  const navigate = useNavigate();

  const login = useCallback(
    (userData) => {
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch({ type: "SET_USER", payload: userData });
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT_USER" });
    navigate("/login");
  }, [dispatch, navigate]);

  const isAuthenticated = !!user;

  return {
    user,
    login,
    logout,
    isAuthenticated,
  };
};
