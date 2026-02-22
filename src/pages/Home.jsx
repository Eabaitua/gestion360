import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>
          La plataforma integral para <span>clubes de pádel</span>
        </h1>
        <p>
          Gestiona reservas, facturación, contabilidad, ESG y pagos online
          desde una sola plataforma.
        </p>
        <button className="cta">Solicitar Demo</button>
      </section>

      <section className="features">
        <div className="card">
          <h3>Reservas Inteligentes</h3>
          <p>Calendario en tiempo real con tarifas dinámicas.</p>
        </div>

        <div className="card">
          <h3>Facturación Automática</h3>
          <p>Control total de ingresos, gastos y proveedores.</p>
        </div>

        <div className="card">
          <h3>Módulo ESG</h3>
          <p>Optimiza consumo energético y mejora rentabilidad.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;