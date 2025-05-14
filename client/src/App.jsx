import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Landing from "./pages/Landing.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import AllStations from "./pages/AllStations.jsx";
import NearbyStations from "./pages/NearbyStations.jsx";
import Settings from "./pages/Settings.jsx";
import SearchStations from "./pages/SearchStations.jsx";
import Station from "./pages/Station.jsx";
import FavoriteStations from "./pages/FavoriteStations.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AllStations />} />
          <Route path="favorites" element={<FavoriteStations />} />
          <Route path="nearby" element={<NearbyStations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="search" element={<SearchStations />} />
          <Route path=":id" element={<Station />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
