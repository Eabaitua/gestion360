import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";

function Dashboard() {
  const [reservas, setReservas] = useState([]);
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    setReservas(JSON.parse(localStorage.getItem("reservas")) || []);
    setFacturas(JSON.parse(localStorage.getItem("facturas")) || []);
  }, []);

  /* =========================
     MÉTRICAS PRINCIPALES
  ========================== */

  const ingresosTotales = reservas
    .filter(r => r.pagado)
    .reduce((acc, r) => acc + r.precio, 0);

  const margenTotal = reservas.reduce(
    (acc, r) => acc + (r.margen || 0),
    0
  );

  const totalHoras = reservas.length;
  const capacidadMaxima = 11 * 11; // 11 pistas x 11 horas
  const ocupacion = (totalHoras / capacidadMaxima) * 100;

  const gastoTotal = facturas.reduce(
    (acc, f) => acc + f.importe,
    0
  );

  const beneficioNeto = ingresosTotales - gastoTotal;

  /* =========================
     INDICADOR SALUD
  ========================== */

  const salud =
    beneficioNeto > 0 && ocupacion > 60
      ? "Excelente"
      : beneficioNeto > 0
      ? "Estable";

  const colorSalud =
    salud === "Excelente"
      ? "#16a34a"
      : salud === "Estable"
      ? "#f59e0b"
      : "#dc2626";

  return (
    <DashboardLayout>
      <h1 style={{ marginBottom: "30px" }}>
        Panel Ejecutivo
      </h1>

      {/* FILA 1 MÉTRICAS */}
      <div style={gridStyle}>
        <Card
          title="Ingresos Totales"
          value={`${ingresosTotales.toFixed(2)}€`}
        />
        <Card
          title="Margen Operativo"
          value={`${margenTotal.toFixed(2)}€`}
        />
        <Card
          title="Ocupación"
          value={`${ocupacion.toFixed(1)}%`}
        />
        <Card
          title="Beneficio Neto"
          value={`${beneficioNeto.toFixed(2)}€`}
          color={beneficioNeto > 0 ? "#16a34a" : "#dc2626"}
        />
      </div>

      {/* SALUD EMPRESA */}
      <div style={bigCard}>
        <h2>Estado del Club</h2>
        <div
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: colorSalud
          }}
        >
          {salud}
        </div>
      </div>

      {/* VISUAL BARRA OCUPACIÓN */}
      <div style={cardStyle}>
        <h3>Uso de Instalaciones</h3>
        <div style={barraFondo}>
          <div
            style={{
              ...barraInterior,
              width: `${ocupacion}%`
            }}
          />
        </div>
        <p style={{ marginTop: "10px" }}>
          {totalHoras} horas ocupadas de {capacidadMaxima}
        </p>
      </div>

      {/* RESUMEN FINANCIERO */}
      <div style={cardStyle}>
        <h3>Resumen Financiero</h3>
        <p>Ingresos: {ingresosTotales.toFixed(2)}€</p>
        <p>Gastos: {gastoTotal.toFixed(2)}€</p>
        <p style={{
          fontWeight: "bold",
          color: beneficioNeto > 0 ? "#16a34a" : "#dc2626"
        }}>
          Resultado: {beneficioNeto.toFixed(2)}€
        </p>
      </div>
    </DashboardLayout>
  );
}

/* COMPONENTE CARD */

function Card({ title, value, color }) {
  return (
    <div style={cardMetric}>
      <div style={{ fontSize: "14px", marginBottom: "10px" }}>
        {title}
      </div>
      <div
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: color || "#111"
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ESTILOS */

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px"
};

const cardMetric = {
  background: "white",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
};

const bigCard = {
  background: "white",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  marginBottom: "30px",
  textAlign: "center"
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  marginBottom: "30px"
};

const barraFondo = {
  width: "100%",
  height: "10px",
  background: "#e5e7eb",
  borderRadius: "10px"
};

const barraInterior = {
  height: "10px",
  background: "#2563eb",
  borderRadius: "10px",
  transition: "0.3s"
};

export default Dashboard;