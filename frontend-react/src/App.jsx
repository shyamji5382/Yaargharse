import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messes from "./pages/Messes";
import Rooms from "./pages/Rooms";
import Vehicles from "./pages/Vehicles";
import MyRentals from "./pages/MyRentals";
import Marketplace from "./pages/Marketplace";
import Libraries from "./pages/Libraries";
import Services from "./pages/Services";
import StudentHelp from "./pages/StudentHelp";
import NearbyEverything from "./pages/NearbyEverything";
import StudentPackage from "./pages/StudentPackage";
import AboutUs from "./pages/AboutUs";
import SmartMatch from "./pages/SmartMatch";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <AuthProvider>
      <div className="texture" />
      <div className="wrap">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/messes" element={<Messes />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/libraries" element={<Libraries />} />
            <Route path="/services" element={<Services />} />
            <Route path="/student-help" element={<StudentHelp />} />
            <Route path="/nearby" element={<NearbyEverything />} />
            <Route path="/student-package" element={<StudentPackage />} />
            <Route path="/smart-match" element={<SmartMatch />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["mess_owner", "room_owner", "vehicle_owner", "library_owner", "service_provider"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-rentals"
              element={
                <ProtectedRoute>
                  <MyRentals />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
