import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { doSignOut } from "../firebase/functions.js";
import { useNavigate } from "react-router-dom";
import { Star, Settings, UserRound, TrainFront, MapPin } from "lucide-react";

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
    name: "Settings",
    icon: <Settings className="text-white w-6 h-6" />,
    link: "/dashboard/settings",
  },
];

export default function SideNav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-blue-500 min-w-56 h-full px-4 py-2 flex flex-col shadow-lg">
      <h1 className="text-3xl font-bold mb-2 text-white ml-2">Citi Bikes</h1>
      <ul className="flex flex-col gap-1 ">
        {navItems.map((item, index) => (
          <li
            key={index}
            className="group flex items-center gap-2 py-2 px-4 rounded-md hover:bg-blue-400 transition duration-300 ease-in-out cursor-pointer"
          >
            <Link
              to={item.link}
              className="flex items-center gap-2 w-full h-full"
            >
              {item.icon}
              <span className="text-white font-semibold">{item.name}</span>
            </Link>
          </li>
        ))}
        <li className="group flex items-center gap-2 py-2 px-4 rounded-md hover:bg-blue-400 transition duration-300 ease-in-out cursor-pointer">
          <button
            className="flex items-center gap-2 w-full h-full cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="text-white w-6 h-6" />
            <span className="text-white font-semibold">Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
