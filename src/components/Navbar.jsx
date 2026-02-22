import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <h2 className="logo">Gestion360</h2>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/login">Acceder</Link>
      </nav>
    </header>
  );
}

export default Navbar;