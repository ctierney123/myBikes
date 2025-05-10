import { House, Settings, UserRound, TrainFront } from "lucide-react";
import SideNav from "../components/SideNav.jsx";
import { Outlet } from "react-router-dom";
const navItems = [
  {
    name: "Home",
    icon: <House className="text-white w-6 h-6" />,
    link: "/dashboard",
  },
  {
    name: "All stations",
    icon: <TrainFront className="text-white w-6 h-6" />,
    link: "/dashboard/stations",
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
