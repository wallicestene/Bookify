/* eslint-disable react/prop-types */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-mobile": "18rem",
      }}
    >
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
