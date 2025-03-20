import { useState } from "react";
import { useEffect } from "react";
import { useUserContext } from "../hooks/Usercontext";
import Bookings from "../components/Bookings";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { Alert } from "@mui/material";
import useServer from "../hooks/ServerUrl";
import fetchWrapper from "../utils/fetchWrapper";
// eslint-disable-next-line react/prop-types
const MyBookings = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [{ user }] = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    const getMyBookings = () => {
      fetchWrapper(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        `${useServer()}api/bookings/?userId=${user?.userId}`,
        {
          method: "GET",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          } else {
            return response.json();
          }
        })
        .then((bookings) => {
          setMyBookings(bookings);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };
    getMyBookings();
  }, [user?.token, user?.userId]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6 py-6 font-Mulish">
      <header>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-gray-500">
          View and manage all your bookings in one place
        </p>
      </header>

      {error && (
        <Alert severity="error" className="my-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <BeatLoader color="#ff7a00" size={20} speedMultiplier={0.8} />
        </div>
      ) : myBookings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myBookings.map((booking) => (
            <Bookings key={booking?._id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 items-start py-6">
          <h2 className="text-xl font-semibold">No Bookings Yet</h2>
          <p className="text-base text-gray-700">
            You {"don't"} have any bookings yet. Start exploring to make your
            first booking.
          </p>
          <button
            onClick={() => navigate("/")}
            className="relative inline-block px-4 py-2 font-medium group transition-all"
          >
            <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
            <span className="absolute inset-0 w-full h-full bg-white border-2 border-black group-hover:bg-black"></span>
            <span className="relative text-base text-black group-hover:text-white">
              Start Searching
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
