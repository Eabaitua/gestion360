import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";

function Caja() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const guardadas = localStorage.getItem("reservas");
    if (guardadas) {
      setReservas(JSON.parse(guardadas));
    }
  }, []);

  const hoy = new Date().toISOString().split("T")[0];

  const reservasHoy = reservas.filter(r => r.fecha === hoy);

  const ingresosOnline = reservasHoy
    .filter(r => r.pagado === true)
    .reduce((acc, r) => acc + r.precio, 0);

  const pagosEnClub = reservasHoy
    .filter(r => r.pagado === false)
    .reduce((acc, r) => acc + r.precio, 0);

  const totalDia = ingresosOnline + pagosEnClub;

  const ingresosPorTipo = reservasHoy.reduce((acc, r) => {
    acc[r.tipo] = (acc[r.tipo] || 0) + r.precio;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <h1 style={{ marginBottom: "30px" }}>Caja del día</h1>

      <div style={gridStyle}>
        <Card title="Ingresos Online" value={`${ingresosOnline}€`} />
        <Card title="Pagos en Club" value={`${pagosEnClub}€`} />
        <Card title="Total del Día" value={`${totalDia}€`} />
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Ingresos por tipo</h2>
        {Object.entries(ingresosPorTipo).map(([tipo, total]) => (
          <p key={tipo}>
            {tipo} → {total}€
          </p>
        ))}
      </div>
    </DashboardLayout>
  );
}

function Card({ title, value }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p style={{ fontSize: "22px", fontWeight: "600" }}>{value}</p>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px"
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
};

export default Caja;