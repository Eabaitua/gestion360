import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
  localStorage.setItem("auth", "true"); // guardamos sesión
  navigate("/dashboard");
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Acceso a Gestion360</h2>

        <input type="email" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />

        <button onClick={handleLogin}>Entrar</button>

        <p className="small-text">
          ¿No tienes cuenta? Contacta con el administrador del club.
        </p>
      </div>
    </div>
  );
}

export default Login;