/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useUserContext } from "../hooks/Usercontext";
import { Navigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const joinDate = new Date(user?.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="space-y-6 px-4 md:px-6 py-6 font-Mulish ">
      <div>
        <h1 className="text-xl font-bold">My Profile</h1>
        <p className="text-gray-500 ">
          Here you can view and manage your profile information
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            {/* Profile Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center pt-4">
                <Avatar className="h-24 w-24 mb-4 text-2xl font-bold">
                  <AvatarFallback className="bg-primary text-primary-foreground ">
                    {user?.first_name[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{`${user?.first_name} ${user?.last_name}`}</h2>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">Joined {joinDate}</span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 py-1"
                  >
                    <CheckCircle className="h-3 w-3" /> Email Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <dl className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">
                      Full Name
                    </dt>
                    <dd className="text-sm sm:w-2/3 mt-1 sm:mt-0">{`${user?.first_name} ${user?.last_name}`}</dd>
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">
                      Email
                    </dt>
                    <dd className="text-sm sm:w-2/3 mt-1 sm:mt-0">
                      {user?.email}
                    </dd>
                  </div>
                  <Separator />
                  {/* <div className="flex flex-col sm:flex-row sm:gap-8">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">
                      Phone
                    </dt>
                    <dd className="text-sm sm:w-2/3 mt-1 sm:mt-0">
                      {user?.phone || "Not added"}
                    </dd>
                  </div>
                  <Separator />
                  <div className="flex flex-col sm:flex-row sm:gap-8">
                    <dt className="text-sm font-medium text-muted-foreground sm:w-1/3">
                      Location
                    </dt>
                    <dd className="text-sm sm:w-2/3 mt-1 sm:mt-0">
                      {user?.location || "Not specified"}
                    </dd>
                  </div> */}
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="grid gap-6">
            {/* Account Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Account Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your account security settings
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage email preferences
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Account Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Your account is verified
                      </p>
                    </div>
                  </div>
                  <Badge>Verified</Badge>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button
                  variant="destructive"
                  onClick={LogOutUser}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Log Out
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
