import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.startsWith("/account");
  return (
    <div>
      {!isDashboard && <Navbar />}
      <Outlet />
      {!isDashboard && <Footer />}
    </div>
  );
};

export default Layout;
