import SideNav from "../components/SideNav.jsx";
import { Outlet } from "react-router-dom";
const navItems = [
  {
    name: "All stations",
    icon: <TrainFront className="text-white w-6 h-6" />,
    link: "/dashboard",
  },
  {
    name: "Favorite Stations",
    icon: <Star className="text-white w-6 h-6" />,
    link: "/dashboard/favorites",
  },
  {
    name: "Nearby Stations",
    icon: <MapPin className="text-white w-6 h-6" />,
    link: "/dashboard/nearby",
  },
  {
    name: "Search Stations",
    icon: <MapPin className="text-white w-6 h-6" />,
    link: "/dashboard/search",
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
      <SideNav />
      <div className="flex-grow">
        <Outlet />
      </div>
    </main>
  );
}
