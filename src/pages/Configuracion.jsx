import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import Cuadrante from "../components/Cuadrante";
import ModalReserva from "../components/ModalReserva";
import { clubModel } from "../config/clubModel";

function Reservas() {
  const pistas = Array.from({ length: 11 }, (_, i) => `Pista ${i + 1}`);
  const horasDisponibles = Array.from({ length: 11 }, (_, i) =>
    `${(10 + i).toString().padStart(2, "0")}:00`
  );

  const hoy = new Date().toISOString().split("T")[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);

  const [reservas, setReservas] = useState(() => {
    const guardadas = localStorage.getItem("reservas");
    return guardadas ? JSON.parse(guardadas) : [];
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

  // 🔥 COSTE ENERGÉTICO DINÁMICO
  const costeEnergia =
    clubModel.energia.consumoKwhPorHora *
    clubModel.energia.precioKwh;

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

  const confirmarReserva = (nombre, apellido, pagado, metodo, tipo) => {
    const costeMonitor =
      clubModel.costesMonitor[tipo] || 0;

    const margen =
      modalDatos.precio - costeEnergia - costeMonitor;

    const nueva = {
      id: Date.now(),
      pista: modalDatos.pista,
      fecha: modalDatos.fecha,
      hora: modalDatos.hora,
      precio: modalDatos.precio,
      jugador: `${nombre} ${apellido}`,
      pagado,
      metodoPago: metodo || "-",
      tipo,
      costeEnergia,
      costeMonitor,
      margen
    };

    setReservas([...reservas, nueva]);
    setModalDatos(null);
    setPista("");
    setFecha("");
    setHora("");
  };

  const eliminarReserva = (id) => {
    setReservas(reservas.filter((r) => r.id !== id));
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
        Gestión de Reservas (Modelo SaaS)
      </h1>

      {/* FORMULARIO */}
      <div style={formStyle}>
        <select value={pista} onChange={(e) => setPista(e.target.value)} style={inputStyle}>
          <option value="">Seleccionar pista</option>
          {pistas.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={inputStyle} />

        <select value={hora} onChange={(e) => setHora(e.target.value)} style={inputStyle}>
          <option value="">Seleccionar hora</option>
          {horasDisponibles.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <button onClick={() => abrirModal(pista, fecha, hora)} style={primaryButton}>
          Crear Reserva
        </button>
      </div>

      {/* TABLA */}
      <div style={tableWrapper}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#1e293b", color: "white" }}>
            <tr>
              <th style={thStyle}>Pista</th>
              <th style={thStyle}>Hora</th>
              <th style={thStyle}>Tipo</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Coste Energía</th>
              <th style={thStyle}>Coste Monitor</th>
              <th style={thStyle}>Margen Real</th>
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
                <td style={tdStyle}>{r.precio}€</td>
                <td style={tdStyle}>{r.costeEnergia.toFixed(2)}€</td>
                <td style={tdStyle}>{r.costeMonitor}€</td>
                <td style={{
                  ...tdStyle,
                  fontWeight: "600",
                  color: r.margen > 0 ? "#16a34a" : "#dc2626"
                }}>
                  {r.margen.toFixed(2)}€
                </td>
                <td style={tdStyle}>
                  {r.pagado ? "Pagado ✅" : "Pendiente 🏢"}
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

      <Cuadrante
        reservas={reservas}
        fechaSeleccionada={fechaSeleccionada}
        onCrearReserva={abrirModal}
      />

      <ModalReserva
        datos={modalDatos}
        onCerrar={() => setModalDatos(null)}
        onConfirmar={confirmarReserva}
      />
    </DashboardLayout>
  );
}

/* ===== ESTILOS ===== */

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

const tableWrapper = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  overflow: "hidden",
  marginBottom: "40px"
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