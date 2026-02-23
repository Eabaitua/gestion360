import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import Cuadrante from "../components/Cuadrante";
import ModalReserva from "../components/ModalReserva";

function Reservas() {

  const pistas = Array.from({ length: 11 }, (_, i) => `Pista ${i + 1}`);
  const horasDisponibles = Array.from({ length: 11 }, (_, i) =>
    `${(10 + i).toString().padStart(2, "0")}:00`
  );

  const hoy = new Date().toISOString().split("T")[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);

  const [reservas, setReservas] = useState(() => {
    try {
      const guardadas = localStorage.getItem("reservas");
      return guardadas ? JSON.parse(guardadas) : [];
    } catch {
      return [];
    }
  });

  const [modalDatos, setModalDatos] = useState(null);
  const [pista, setPista] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  useEffect(() => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
  }, [reservas]);

  const calcularPrecio = (hora) => {
    const horaNumero = parseInt(hora.split(":")[0]);
    return horaNumero >= 18 ? 30 : 20;
  };

  const cambiarDia = (dias) => {
    const fecha = new Date(fechaSeleccionada);
    fecha.setDate(fecha.getDate() + dias);
    setFechaSeleccionada(fecha.toISOString().split("T")[0]);
  };

  const abrirModal = (pista, fecha, hora) => {
    if (!pista || !fecha || !hora) {
      alert("Selecciona pista, fecha y hora");
      return;
    }

    const existe = reservas.some(
      (r) => r.pista === pista && r.fecha === fecha && r.hora === hora
    );

    if (existe) {
      alert("Esa pista ya está reservada.");
      return;
    }

    setModalDatos({
      pista,
      fecha,
      hora,
      precio: calcularPrecio(hora),
    });
  };

  const confirmarReserva = (
    nombre,
    apellido,
    pagado,
    metodo,
    tipo,
    jugadores,
    monitor
  ) => {

    const nueva = {
      id: Date.now(),
      pista: modalDatos.pista,
      fecha: modalDatos.fecha,
      hora: modalDatos.hora,
      precio: modalDatos.precio,
      jugadorPrincipal: `${nombre} ${apellido}`,
      pagado,
      metodoPago: metodo || "-",
      tipo,
      jugadores: jugadores || [],
      monitor: monitor || null
    };

    setReservas((prev) => [...prev, nueva]);
    setModalDatos(null);
  };

  const eliminarReserva = (id) => {
    setReservas((prev) => prev.filter((r) => r.id !== id));
  };

  const textoTipo = {
    partido: "🎾 Partido",
    clase: "👨‍🏫 Clase particular",
    adultos: "👥 Escuela adultos",
    menores: "🧒 Escuela menores"
  };

  return (
    <DashboardLayout>

      <h1 style={{ marginBottom: "20px" }}>
        Gestión de Reservas PRO
      </h1>

      {/* FORMULARIO */}
      <div style={formStyle}>
        <select value={pista} onChange={(e) => setPista(e.target.value)} style={inputStyle}>
          <option value="">Seleccionar pista</option>
          {pistas.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={inputStyle}
        />

        <select value={hora} onChange={(e) => setHora(e.target.value)} style={inputStyle}>
          <option value="">Seleccionar hora</option>
          {horasDisponibles.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <button
          onClick={() => abrirModal(pista, fecha, hora)}
          style={primaryButton}
        >
          Crear Reserva
        </button>
      </div>

      {/* SELECTOR DÍA PRO */}
      <div style={selectorDiaWrapper}>
        <button style={navButton} onClick={() => cambiarDia(-1)}>⬅</button>

        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          style={inputStyle}
        />

        <button style={navButton} onClick={() => cambiarDia(1)}>➡</button>

        <button style={todayButton} onClick={() => setFechaSeleccionada(hoy)}>
          Hoy
        </button>
      </div>

      {/* CUADRANTE */}
      <Cuadrante
        reservas={reservas}
        fechaSeleccionada={fechaSeleccionada}
        onCrearReserva={abrirModal}
      />

      {/* TABLA */}
      <div style={tableWrapper}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#1e293b", color: "white" }}>
            <tr>
              <th style={thStyle}>Pista</th>
              <th style={thStyle}>Hora</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Jugadores / Monitor</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reservas.map((r) => (
              <tr key={r.id} style={{ textAlign: "center" }}>
                <td style={tdStyle}>{r.pista}</td>
                <td style={tdStyle}>{r.hora}</td>
                <td style={tdStyle}>{textoTipo[r.tipo]}</td>
                <td style={tdStyle}>
                  {r.tipo === "partido" && r.jugadores?.join(", ")}
                  {(r.tipo === "clase" ||
                    r.tipo === "adultos" ||
                    r.tipo === "menores") &&
                    r.monitor && `Monitor: ${r.monitor}`}
                </td>
                <td style={tdStyle}>{r.precio}€</td>
                <td style={tdStyle}>
                  {r.pagado ? "Pagado ✅" : "Pendiente"}
                </td>
                <td style={tdStyle}>
                  <button onClick={() => eliminarReserva(r.id)} style={dangerButton}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalReserva
        datos={modalDatos}
        onCerrar={() => setModalDatos(null)}
        onConfirmar={confirmarReserva}
      />

    </DashboardLayout>
  );
}

/* ESTILOS */

const formStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "30px"
};

const selectorDiaWrapper = {
  background: "white",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px"
};

const navButton = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#e5e7eb",
  cursor: "pointer"
};

const todayButton = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const tableWrapper = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  overflow: "hidden",
  marginTop: "30px"
};

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px"
};

const primaryButton = {
  background: "#22c55e",
  color: "white",
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer"
};

const dangerButton = {
  background: "#ef4444",
  color: "white",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
};

const thStyle = { padding: "12px" };
const tdStyle = { padding: "10px", borderTop: "1px solid #e2e8f0" };

export default Reservas;