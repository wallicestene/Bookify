import { toast } from "sonner";

const fetchWrapper = async (url, options = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    // Ensuring Authorization header is added to all requests if a token exists
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(url, options);
    // If the token is invalid or expired, log out the user
    if (response.status === 401) {
      // Remove the user from local storage
      toast("Your session has expired. Please log in again to continue.");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    // handling successful responses
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default fetchWrapper;
