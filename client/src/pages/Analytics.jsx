/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { analyticsAPI } from "../services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import BeatLoader from "react-spinners/BeatLoader";
import { useUserContext } from "../hooks/Usercontext";
import { Alert } from "@mui/material";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Home,
  LineChartIcon,
  Plus,
  TrendingUp,
} from "lucide-react";

const Analytics = () => {
  const [{ user }] = useUserContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    bookingsByMonth: [],
    revenueByMonth: [],
    topProperties: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const analyticsData = await analyticsAPI.getOwnerStats();
        setStats(analyticsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchAnalytics();
    }
  }, [user?.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <BeatLoader color="#f97316" size={20} speedMultiplier={0.8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }
  //   if no data because the user has not properties
  if (!stats.totalBookings && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="border-2 border-dashed border-gray-300 bg-white shadow-sm">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
              <div className="rounded-full bg-orange-50 p-4 mb-6">
                <BarChart3 className="h-12 w-12 text-orange-500" />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No Analytics Available Yet
              </h2>

              <p className="text-gray-600 max-w-md mb-8">
                Start listing properties and receiving bookings to access your
                analytics dashboard with valuable insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/account/myListings">
                  <Button variant="outline" className="flex items-center gap-2 border-gray-300 hover:border-orange-500 hover:text-orange-500">
                    <Home className="h-4 w-4" />
                    <span>View My Listings</span>
                  </Button>
                </Link>

                <Link to="/account/myProperties/new">
                  <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="h-4 w-4" />
                    <span>Add New Property</span>
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <Calendar className="h-5 w-5 mb-1 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Booking Insights</h3>
                  <p className="text-xs text-gray-600">
                    Track occupancy rates
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <LineChartIcon className="h-5 w-5 mb-1 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Revenue Tracking</h3>
                  <p className="text-xs text-gray-600">
                    Monitor earnings
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <TrendingUp className="h-5 w-5 mb-1 text-gray-600" />
                  <h3 className="font-medium text-gray-900">Performance Stats</h3>
                  <p className="text-xs text-gray-600">
                    Optimize listings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6 py-8 font-Mulish">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            View and analyze your property statistics
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 truncate">
                {stats.totalBookings}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue (in Ksh)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 truncate">
                {stats.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Occupancy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 truncate">
                {stats.occupancyRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="bookings">
          <TabsList className="mb-4 bg-white border border-gray-200">
            <TabsTrigger 
              value="bookings"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="revenue"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Revenue
            </TabsTrigger>
            <TabsTrigger 
              value="properties"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Properties
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Booking Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.bookingsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f97316"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Top Performing Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topProperties.map((property) => (
                    <>
                      <div
                        key={property.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{property.name}</p>
                          <p className="text-gray-600 text-sm">
                            {property.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {property.bookings} booking
                            {property.bookings > 1 && "s"}
                          </p>
                          <p className="text-gray-600 text-sm">
                            ${property.revenue} revenue
                          </p>
                        </div>
                      </div>
                      <Separator className="bg-gray-200" />
                    </>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
