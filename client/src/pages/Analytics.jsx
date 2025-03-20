/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import useServer from "../hooks/ServerUrl";
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
  const serverUrl = useServer();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${serverUrl}api/analytics/owner`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchAnalytics();
    }
  }, [user?.userId, user?.token, serverUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <BeatLoader color="#ff7a00" size={20} speedMultiplier={0.8} />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  //   if no data because the user has not properties
  if (!stats.totalBookings && !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="border-dashed">
          <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-6">
              <BarChart3 className="h-12 w-12 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold mb-2">
              No Analytics Available Yet
            </h2>

            <p className="text-muted-foreground max-w-md mb-8">
              Start listing properties and receiving bookings to access your
              analytics dashboard with valuable insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/account/myListings">
                <Button variant="outline" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>View My Listings</span>
                </Button>
              </Link>

              <Link to="/account/myProperties/new">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add New Property</span>
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="p-4 rounded-lg bg-secondary/50">
                <Calendar className="h-5 w-5 mb-1 text-muted-foreground" />
                <h3 className="font-medium">Booking Insights</h3>
                <p className="text-xs text-muted-foreground">
                  Track occupancy rates
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50">
                <LineChartIcon className="h-5 w-5 mb-1 text-muted-foreground" />
                <h3 className="font-medium">Revenue Tracking</h3>
                <p className="text-xs text-muted-foreground">
                  Monitor earnings
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50">
                <TrendingUp className="h-5 w-5 mb-1 text-muted-foreground" />
                <h3 className="font-medium">Performance Stats</h3>
                <p className="text-xs text-muted-foreground">
                  Optimize listings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6 px-4 md:px-6 py-4 font-Mulish">
      <div>
        <h1 className="text-xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-500 ">
          Here you can view and analyze your property statistics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {stats.totalBookings}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue(in Ksh)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {stats.occupancyRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="bookings">
        <TabsList className="mb-4">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.bookingsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
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
                        <p className="font-medium">{property.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {property.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {property.bookings} booking
                          {property.bookings > 1 && "s"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          ${property.revenue} revenue
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
