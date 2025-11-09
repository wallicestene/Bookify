/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useUserContext } from "../hooks/Usercontext";
import { Navigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import {
  Edit,
  LogOut,
  Mail,
  Calendar,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

const Profile = () => {
  const [redirect, setRedirect] = useState(null);
  const [{ user }, dispatch] = useUserContext();

  const LogOutUser = () => {
    localStorage.removeItem("user");
    dispatch({
      type: "LOGOUT_USER",
    });
    setRedirect("/");
  };

  if (!user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  // Format join date
  const joinDate = moment(user?.createdAt).format("LL");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-4 md:px-6 py-8 font-Mulish">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            View and manage your profile information
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 bg-white border border-gray-200">
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="account"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              {/* Profile Card */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-gray-900">Profile</CardTitle>
                  <CardDescription className="text-gray-600">Your personal information</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center pt-4">
                  <Avatar className="h-24 w-24 mb-4 text-2xl font-bold border-2 border-orange-500">
                    <AvatarFallback className="bg-orange-500 text-white">
                      {user?.first_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-gray-900">{`${user?.first_name} ${user?.last_name}`}</h2>
                  <div className="flex items-center mt-2 text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center mt-2 text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm">Joined {joinDate}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 py-1 border-green-500 text-green-700 bg-green-50"
                    >
                      <CheckCircle className="h-3 w-3" /> Email Verified
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details Card */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-gray-900">Personal Information</CardTitle>
                    <CardDescription className="text-gray-600">Your personal details</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 hover:text-orange-500">
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4">
                  <dl className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:gap-8">
                      <dt className="text-sm font-medium text-gray-600 sm:w-1/3">
                        Full Name
                      </dt>
                      <dd className="text-sm text-gray-900 sm:w-2/3 mt-1 sm:mt-0">{`${user?.first_name} ${user?.last_name}`}</dd>
                    </div>
                    <Separator className="bg-gray-200" />
                    <div className="flex flex-col sm:flex-row sm:gap-8">
                      <dt className="text-sm font-medium text-gray-600 sm:w-1/3">
                        Email
                      </dt>
                      <dd className="text-sm text-gray-900 sm:w-2/3 mt-1 sm:mt-0">
                        {user?.email}
                      </dd>
                    </div>
                    <Separator className="bg-gray-200" />
                  </dl>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="grid gap-6">
              {/* Account Card */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Account Settings</CardTitle>
                  <CardDescription className="text-gray-600">Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Account Security</h3>
                      <p className="text-sm text-gray-600">
                        Manage your account security settings
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:border-orange-500 hover:text-orange-500">
                      Change Password
                    </Button>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Manage email preferences
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300 hover:border-orange-500 hover:text-orange-500">
                      Update
                    </Button>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Account Verification</h3>
                        <p className="text-sm text-gray-600">
                          Your account is verified
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Verified</Badge>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-200 pt-6">
                  <Button
                    variant="destructive"
                    onClick={LogOutUser}
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Log Out
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
