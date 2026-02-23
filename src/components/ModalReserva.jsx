import "./ModalReserva.css";
import { useState } from "react";

function ModalReserva({ datos, onCerrar, onConfirmar }) {

  const [tipo, setTipo] = useState("partido");
  const [pagado, setPagado] = useState(true);

  // 🔥 Base datos jugadores
  const jugadoresBD = [
    "Iker", "Unai", "Mikel", "Ander", "Gorka",
    "Jon", "Aitor", "Markel", "Asier", "Eneko",
    "Hugo", "Mario", "Dani", "Alex", "Pablo",
    "Carlos", "Luis", "Sergio", "Raúl", "David"
  ];

  const monitores = ["Masa", "Jon", "Kepa", "Aitor"];

  const [jugadoresSeleccionados, setJugadoresSeleccionados] = useState([]);
  const [monitor, setMonitor] = useState("");

  if (!datos) return null;

  const toggleJugador = (j) => {
    if (jugadoresSeleccionados.includes(j)) {
      setJugadoresSeleccionados(
        jugadoresSeleccionados.filter((x) => x !== j)
      );
    } else {
      if (jugadoresSeleccionados.length < 4) {
        setJugadoresSeleccionados([...jugadoresSeleccionados, j]);
      }
    }
  };

  const confirmar = () => {

    if (tipo === "partido" && jugadoresSeleccionados.length !== 4) {
      alert("Debes seleccionar 4 jugadores");
      return;
    }

    if (
      (tipo === "clase" || tipo === "adultos" || tipo === "menores") &&
      !monitor
    ) {
      alert("Selecciona un monitor");
      return;
    }

    // 🔥 Las clases siempre pagadas
    const estadoPago =
      tipo === "partido" ? pagado : true;

    onConfirmar(
      "", 
      "",
      estadoPago,
      "manual",
      tipo,
      jugadoresSeleccionados,
      monitor
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Nueva Reserva</h2>

        <p><strong>Pista:</strong> {datos.pista}</p>
        <p><strong>Hora:</strong> {datos.hora}</p>
        <p><strong>Precio:</strong> {datos.precio}€</p>

        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            if (e.target.value !== "partido") {
              setPagado(true);
            }
          }}
        >
          <option value="partido">🎾 Partido</option>
          <option value="clase">👨‍🏫 Clase particular</option>
          <option value="adultos">👥 Escuela adultos</option>
          <option value="menores">🧒 Escuela menores</option>
        </select>

        {/* 🎾 PARTIDO */}
        {tipo === "partido" && (
          <>
            <h4>Selecciona 4 jugadores</h4>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {jugadoresBD.map((j) => (
                <button
                  key={j}
                  onClick={() => toggleJugador(j)}
                  style={{
                    background: jugadoresSeleccionados.includes(j)
                      ? "#3b82f6"
                      : "#e5e7eb",
                    color: jugadoresSeleccionados.includes(j)
                      ? "white"
                      : "black",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  {j}
                </button>
              ))}
            </div>

            {/* 🔥 OPCIÓN PAGADO */}
            <div style={{ marginTop: "15px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={pagado}
                  onChange={() => setPagado(!pagado)}
                />
                &nbsp; Partido pagado
              </label>
            </div>
          </>
        )}

        {/* 👨‍🏫 CLASES */}
        {(tipo === "clase" ||
          tipo === "adultos" ||
          tipo === "menores") && (
          <>
            <h4>Selecciona monitor</h4>

            <select
              value={monitor}
              onChange={(e) => setMonitor(e.target.value)}
            >
              <option value="">Seleccionar monitor</option>
              {monitores.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>

            <p style={{ marginTop: "10px", color: "#16a34a" }}>
              ✔ Las clases se registran como pagadas automáticamente
            </p>
          </>
        )}

        <div className="modal-buttons">
          <button onClick={onCerrar}>Cancelar</button>
          <button onClick={confirmar}>Confirmar</button>
        </div>

      </div>
    </div>
  );
}

export default ModalReserva;