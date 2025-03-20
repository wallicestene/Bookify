/* eslint-disable react/prop-types */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/Usercontext";
const DashboardLayout = () => {
  const [{ user }] = useUserContext();

  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-mobile": "18rem",
      }}
    >
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
