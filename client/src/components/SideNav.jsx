import { Link } from "react-router-dom";

export default function SideNav({ navItems }) {
  return (
    <nav className="bg-blue-500 w-52 h-full px-4 py-2 flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold mb-2 text-white">Citi Bikes</h1>
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
      </ul>
    </nav>
  );
}
