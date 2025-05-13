import SideNav from "../components/SideNav.jsx";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <main className="w-full h-screen flex bg-[#f1f5f9]">
      <SideNav />
      <div className="flex-grow">
        <Outlet />
      </div>
    </main>
  );
}
