import { House, LogOut, Settings, UserRound } from "lucide-react";
import SideNav from "../components/SideNav.jsx";
import { Outlet } from "react-router-dom";

const navItems = [
  {
    name: "Home",
    icon: <House className="text-white w-6 h-6" />,
    link: "/dashboard",
  },
  {
    name: "Profile",
    icon: <UserRound className="text-white w-6 h-6" />,
    link: "/dashboard/profile",
  },
  {
    name: "Settings",
    icon: <Settings className="text-white w-6 h-6" />,
    link: "/dashboard/settings",
  },
  {
    name: "Logout",
    icon: <LogOut className="text-white w-6 h-6" />,
    link: "/logout",
  },
];

export default function DashboardLayout() {
  return (
    <main className="w-full h-screen flex bg-[#f1f5f9]">
      <SideNav navItems={navItems} />
      <div className="flex-grow p-4">
        <Outlet />
      </div>
    </main>
  );
}
