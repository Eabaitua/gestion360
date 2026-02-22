import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";

function ESG() {
  const [reservas, setReservas] = useState([]);
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    setReservas(JSON.parse(localStorage.getItem("reservas")) || []);
    setFacturas(JSON.parse(localStorage.getItem("facturas")) || []);
  }, []);

  /* =========================
     ENVIRONMENTAL
  ========================== */

  const consumoKwhPorHora = 3; // indoor LED
  const factorCO2 = 0.25; // kg CO2 por kWh

  const totalHoras = reservas.length;
  const consumoTotal = totalHoras * consumoKwhPorHora;
  const emisionesCO2 = consumoTotal * factorCO2;

  const eficienciaEnergetica =
    consumoTotal > 0 ? 100 - emisionesCO2 : 100;

  /* =========================
     SOCIAL
  ========================== */

  const escuelaMenores = reservas.filter(r => r.tipo === "menores").length;
  const escuelaAdultos = reservas.filter(r => r.tipo === "adultos").length;

  const totalEscuela = escuelaMenores + escuelaAdultos;

  const porcentajeMenores =
    totalEscuela > 0
      ? (escuelaMenores / totalEscuela) * 100
      : 0;

  /* =========================
     GOVERNANCE
  ========================== */

  const pagosDigitales = reservas.filter(r => r.metodoPago === "tarjeta" || r.metodoPago === "bizum").length;
  const totalPagos = reservas.length;

  const porcentajeDigital =
    totalPagos > 0
      ? (pagosDigitales / totalPagos) * 100
      : 0;

  const digitalizacionFacturas =
    facturas.length > 0 ? 100 : 0;

  /* =========================
     SCORE GLOBAL ESG
  ========================== */

  const scoreESG =
    (eficienciaEnergetica * 0.4) +
    (porcentajeMenores * 0.3) +
    (porcentajeDigital * 0.3);

  const colorScore =
    scoreESG > 75
      ? "#16a34a"
      : scoreESG > 50
      ? "#f59e0b"
      : "#dc2626";

  return (
    <DashboardLayout>
      <h1 style={{ marginBottom: "20px" }}>Panel ESG Inteligente</h1>

      {/* SCORE GLOBAL */}
      <div style={scoreCard}>
        <h2>Score ESG Global</h2>
        <div style={{ fontSize: "40px", fontWeight: "bold", color: colorScore }}>
          {scoreESG.toFixed(1)}%
        </div>
      </div>

      {/* ENVIRONMENTAL */}
      <Section title="🌱 Environmental">
        <Metric label="Consumo energético total (kWh)" value={consumoTotal} />
        <Metric label="Emisiones CO₂ estimadas (kg)" value={emisionesCO2.toFixed(2)} />
        <Metric label="Eficiencia energética (%)" value={eficienciaEnergetica.toFixed(1)} />
      </Section>

      {/* SOCIAL */}
      <Section title="👥 Social">
        <Metric label="Escuela menores" value={escuelaMenores} />
        <Metric label="Escuela adultos" value={escuelaAdultos} />
        <Metric label="% participación menores" value={porcentajeMenores.toFixed(1) + "%"} />
      </Section>

      {/* GOVERNANCE */}
      <Section title="🏛 Governance">
        <Metric label="% Pagos digitales" value={porcentajeDigital.toFixed(1) + "%"} />
        <Metric label="Digitalización facturas" value={digitalizacionFacturas + "%"} />
      </Section>
    </DashboardLayout>
  );
}

/* COMPONENTES */

function Section({ title, children }) {
  return (
    <div style={sectionStyle}>
      <h3 style={{ marginBottom: "15px" }}>{title}</h3>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={metricCard}>
      <div style={{ fontSize: "14px", marginBottom: "8px" }}>
        {label}
      </div>
      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
        {value}
      </div>
    </div>
  );
}

/* ESTILOS */

const scoreCard = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  marginBottom: "40px",
  textAlign: "center"
};

const sectionStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  marginBottom: "30px"
};

const metricCard = {
  background: "#f8fafc",
  padding: "20px",
  borderRadius: "10px",
  minWidth: "200px"
};

export default ESG;