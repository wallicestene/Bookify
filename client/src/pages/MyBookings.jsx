import { useState } from "react";
import { useEffect } from "react";
import { useUserContext } from "../hooks/Usercontext";
import Bookings from "../components/Bookings";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { Alert } from "@mui/material";
import { bookingAPI } from "../services/api";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Calendar, CalendarDays, Home, Search, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import RecommendedProperties from "../components/RecommendedProperties";

// eslint-disable-next-line react/prop-types
const MyBookings = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [{ user }] = useUserContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    const getMyBookings = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const bookings = await bookingAPI.getUserBookings(user.userId);
        const safeBookings = Array.isArray(bookings) ? bookings : [];
        setMyBookings(safeBookings);
      } catch (err) {
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    getMyBookings();
  }, [user?.userId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6 py-8 font-Mulish">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your bookings in one place
          </p>
        </div>
        {loading && (
          <div className="flex justify-center items-center h-48">
            <BeatLoader color="#f97316" size={20} speedMultiplier={0.8} />
          </div>
        )}
        {error && (
          <div className="w-full h-48 flex items-center justify-center">
            <Alert severity="error">{error}</Alert>
          </div>
        )}
        {myBookings.length === 0 && !loading && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <Card className="border-2 border-dashed border-gray-300 bg-white shadow-sm">
              <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
                <div className="rounded-full bg-orange-50 p-4 mb-6">
                  <Calendar className="h-12 w-12 text-orange-500" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Bookings Yet</h2>

                <p className="text-gray-600 max-w-md mb-8">
                  You {"haven't"} made any bookings yet. Explore our properties
                  and book your next stay!
                </p>

                <Button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Search className="h-4 w-4" />
                  <span>Explore Properties</span>
                </Button>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <Home className="h-5 w-5 mb-1 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Find Places</h3>
                    <p className="text-xs text-gray-600">
                      Browse unique accommodations
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <CalendarDays className="h-5 w-5 mb-1 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Book Stays</h3>
                    <p className="text-xs text-gray-600">
                      Secure your reservation
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <Star className="h-5 w-5 mb-1 text-gray-600" />
                    <h3 className="font-medium text-gray-900">Leave Reviews</h3>
                    <p className="text-xs text-gray-600">
                      Share your experiences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {!loading && myBookings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myBookings.map((booking) => (
              <Bookings key={booking?._id} booking={booking} />
            ))}
          </div>
        )}
        
        {/* recommendations */}
        <div className="w-full py-12 px-4 md:px-6 lg:px-12">
          <RecommendedProperties type="general" />
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
