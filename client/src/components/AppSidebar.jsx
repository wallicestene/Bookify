/* eslint-disable no-unused-vars */
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar } from "@/components/ui/avatar";

import { BarChart, Calendar, Home, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "../hooks/Usercontext";

const AppSidebar = () => {
  const { pathname } = useLocation();
  const [{ user }, dispatch] = useUserContext();

  const { isMobile } = useSidebar();

  const navigation = [
    {
      title: "Account",
      href: "/account",
      icon: User,
    },
    {
      title: "My Bookings",
      href: "/account/myBookings",
      icon: Calendar,
    },
    {
      title: "My Listings",
      href: "/account/myListings",
      icon: Home,
    },
    {
      title: "Analytics",
      href: "/account/analytics",
      icon: BarChart,
    },
  ];

  const handleLogOut = () => {
    dispatch({ type: "LOGOUT_USER" });
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="font-mulish ">
      <SidebarHeader className=" text-totem-pole-500 tracking-tight text-base font-semibold leading-3 overflow-hidden whitespace-nowrap text-ellipsis">
        Bookify
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className={` flex items-center gap-3 w-full ${
                        pathname === item.href && " bg-secondary"
                      }`}
                    >
                      <item.icon className=" h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pl-2">
        <SidebarMenu>
          <SidebarMenuItem asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grid place-items-center text-base font-semibold bg-slate-900 text-slate-100">
                {user?.first_name[0]}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.first_name}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogOut}
              className="flex items-center gap-2 w-full text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
