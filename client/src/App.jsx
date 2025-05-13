import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Landing from "./pages/Landing.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import AllStations from "./pages/AllStations.jsx";
import NearbyStations from "./pages/NearbyStations.jsx";
import SearchStations from "./pages/SearchStations.jsx";
import Station from "./pages/Station.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="stations/:id" element={<AllStations />} />
          <Route path="favorites" element={<h1>Favorites</h1>} />
          <Route path="nearby" element={<NearbyStations />} />
          <Route path="search" element={<SearchStations />} />
          <Route path=":id" element={<Station />} />
          <Route path="profile" element={<h1>Profile</h1>} />
          <Route path="settings" element={<h1>Settings</h1>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
