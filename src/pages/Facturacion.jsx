import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";

function Facturacion() {
  const [facturas, setFacturas] = useState(() => {
    return JSON.parse(localStorage.getItem("facturas")) || [];
  });

  const [archivo, setArchivo] = useState(null);
  const [proveedor, setProveedor] = useState("");
  const [importe, setImporte] = useState("");
  const [tipo, setTipo] = useState("energia");

  const tipos = {
    energia: { label: "⚡ Energía", color: "#facc15" },
    proveedor: { label: "🏢 Proveedor", color: "#60a5fa" },
    mantenimiento: { label: "🔧 Mantenimiento", color: "#f87171" },
    nomina: { label: "👤 Nómina", color: "#34d399" },
    alquiler: { label: "🏠 Alquiler", color: "#a78bfa" },
    otros: { label: "📦 Otros", color: "#94a3b8" }
  };

  useEffect(() => {
    localStorage.setItem("facturas", JSON.stringify(facturas));
  }, [facturas]);

  const subirFactura = () => {
    if (!archivo || !proveedor || !importe) {
      alert("Completa todos los campos");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nuevaFactura = {
        id: Date.now(),
        nombre: archivo.name,
        proveedor,
        importe: parseFloat(importe),
        tipo,
        fecha: new Date().toISOString().split("T")[0],
        mes: new Date().getMonth(),
        anio: new Date().getFullYear(),
        data: reader.result
      };

      setFacturas([...facturas, nuevaFactura]);
      setArchivo(null);
      setProveedor("");
      setImporte("");
    };

    reader.readAsDataURL(archivo);
  };

  const eliminarFactura = (id) => {
    setFacturas(facturas.filter((f) => f.id !== id));
  };

  /* ===== MÉTRICAS ===== */

  const mesActual = new Date().getMonth();
  const anioActual = new Date().getFullYear();

  const facturasMesActual = facturas.filter(
    (f) => f.mes === mesActual && f.anio === anioActual
  );

  const facturasMesAnterior = facturas.filter(
    (f) =>
      f.mes === mesActual - 1 &&
      f.anio === anioActual
  );

  const totalMesActual = facturasMesActual.reduce(
    (acc, f) => acc + f.importe,
    0
  );

  const totalMesAnterior = facturasMesAnterior.reduce(
    (acc, f) => acc + f.importe,
    0
  );

  const variacion =
    totalMesAnterior > 0
      ? ((totalMesActual - totalMesAnterior) / totalMesAnterior) * 100
      : 0;

  const gastosPorTipo = Object.keys(tipos).map((key) => {
    const total = facturasMesActual
      .filter((f) => f.tipo === key)
      .reduce((acc, f) => acc + f.importe, 0);

    return { tipo: key, total };
  });

  const exportarCSV = () => {
    const encabezado = "Proveedor,Tipo,Importe,Fecha\n";
    const filas = facturas
      .map((f) =>
        `${f.proveedor},${tipos[f.tipo].label},${f.importe},${f.fecha}`
      )
      .join("\n");

    const blob = new Blob([encabezado + filas], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "facturas.csv";
    a.click();
  };

  return (
    <DashboardLayout>
      <h1 style={{ marginBottom: "20px" }}>Facturación Inteligente</h1>

      {/* DASHBOARD */}
      <div style={dashboardStyle}>
        <Metric title="Gasto mes actual" value={`${totalMesActual.toFixed(2)}€`} />
        <Metric title="Gasto mes anterior" value={`${totalMesAnterior.toFixed(2)}€`} />
        <Metric
          title="Variación mensual"
          value={`${variacion.toFixed(1)}%`}
          color={variacion > 0 ? "#dc2626" : "#16a34a"}
        />
      </div>

      {/* GASTO POR TIPO */}
      <div style={cardStyle}>
        <h3>Distribución por tipo (mes actual)</h3>
        {gastosPorTipo.map((g) => (
          <div key={g.tipo} style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "14px" }}>
              {tipos[g.tipo].label} - {g.total.toFixed(2)}€
            </div>
            <div
              style={{
                height: "6px",
                background: "#e5e7eb",
                borderRadius: "6px"
              }}
            >
              <div
                style={{
                  width:
                    totalMesActual > 0
                      ? `${(g.total / totalMesActual) * 100}%`
                      : "0%",
                  height: "6px",
                  background: tipos[g.tipo].color,
                  borderRadius: "6px"
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* SUBIR FACTURA */}
      <div style={cardStyle}>
        <h3>Subir Factura</h3>

        <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle}>
          {Object.keys(tipos).map((key) => (
            <option key={key} value={key}>
              {tipos[key].label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Proveedor"
          value={proveedor}
          onChange={(e) => setProveedor(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Importe €"
          value={importe}
          onChange={(e) => setImporte(e.target.value)}
          style={inputStyle}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setArchivo(e.target.files[0])}
          style={inputStyle}
        />

        <button onClick={subirFactura} style={buttonStyle}>
          Subir
        </button>

        <button onClick={exportarCSV} style={{ ...buttonStyle, marginLeft: "10px", background: "#16a34a" }}>
          Exportar CSV
        </button>
      </div>

      {/* LISTADO */}
      <div style={cardStyle}>
        <h3>Archivo de Facturas</h3>

        {facturas.map((f) => (
          <div key={f.id} style={facturaStyle}>
            <div>
              <strong>{f.proveedor}</strong>
              <div style={{ fontSize: "12px" }}>
                {tipos[f.tipo].label} • {f.importe}€ • {f.fecha}
              </div>
            </div>

            <div>
              <a href={f.data} download={f.nombre}>
                Descargar
              </a>
              <button onClick={() => eliminarFactura(f.id)} style={dangerButton}>
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

/* COMPONENTE MÉTRICA */
function Metric({ title, value, color }) {
  return (
    <div style={metricCard}>
      <h4>{title}</h4>
      <div style={{ fontSize: "22px", fontWeight: "bold", color: color || "#111" }}>
        {value}
      </div>
    </div>
  );
}

/* ESTILOS */
const dashboardStyle = { display: "flex", gap: "20px", marginBottom: "30px" };
const metricCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.05)"
};
const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
  marginBottom: "30px"
};
const facturaStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #e5e7eb"
};
const inputStyle = {
  padding: "8px",
  marginRight: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb"
};
const buttonStyle = {
  background: "#2563eb",
  color: "white",
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
};
const dangerButton = {
  background: "#ef4444",
  color: "white",
  padding: "4px 8px",
  borderRadius: "6px",
  border: "none",
  marginLeft: "10px",
  cursor: "pointer"
};

export default Facturacion;