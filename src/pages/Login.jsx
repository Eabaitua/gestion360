import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (usuario.trim() === "eduardo" && password.trim() === "eduardo") {
      localStorage.setItem("auth", "true");
      setError("");
      navigate("/dashboard");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h2>Acceso Gestión Club</h2>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              setError("");
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />

          <button type="submit">
            Entrar
          </button>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

        </form>

      </div>

    </div>
  );
}

export default Login;