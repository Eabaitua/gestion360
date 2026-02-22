import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reservas from "./pages/Reservas";
import Caja from "./pages/Caja";
import Facturacion from "./pages/Facturacion";
import ESG from "./pages/ESG";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservas"
          element={
            <ProtectedRoute>
              <Reservas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/caja"
          element={
            <ProtectedRoute>
              <Caja />
            </ProtectedRoute>
          }
        />

        <Route
          path="/facturacion"
          element={
            <ProtectedRoute>
              <Facturacion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/esg"
          element={
            <ProtectedRoute>
              <ESG />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;