import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">Gestion360</h2>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/reservas">Reservas</Link>
        <Link to="/facturacion">Facturación</Link>
        <Link to="/esg">ESG</Link>
      </nav>
    </div>
  );
}

export default Sidebar;