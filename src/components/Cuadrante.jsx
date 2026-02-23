import "./Cuadrante.css";

function Cuadrante({ reservas, fechaSeleccionada, onCrearReserva }) {

  const pistas = Array.from({ length: 11 }, (_, i) => `Pista ${i + 1}`);
  const horas = Array.from({ length: 11 }, (_, i) =>
    `${(10 + i).toString().padStart(2, "0")}:00`
  );

  const obtenerReserva = (pista, hora) => {
    return reservas.find(
      (r) =>
        r.pista === pista &&
        r.hora === hora &&
        r.fecha === fechaSeleccionada
    );
  };

  const textoTipo = {
    partido: "🎾 Partido",
    clase: "👨‍🏫 Clase particular",
    adultos: "👥 Escuela adultos",
    menores: "🧒 Escuela menores"
  };

  return (
    <div className="cuadrante">
      <h3>Cuadrante del día: {fechaSeleccionada}</h3>

      <table>
        <thead>
          <tr>
            <th>Pista / Hora</th>
            {horas.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pistas.map((p) => (
            <tr key={p}>
              <td className="pista-label">{p}</td>

              {horas.map((h) => {
                const reserva = obtenerReserva(p, h);
                const ocupada = !!reserva;

                return (
                  <td
                    key={h}
                    className={
                      ocupada
                        ? `ocupada ${reserva.tipo}`
                        : "libre"
                    }
                    onClick={() => {
                      if (!ocupada) {
                        onCrearReserva(p, fechaSeleccionada, h);
                      }
                    }}
                  >
                    {ocupada ? (
                      <>
                        {textoTipo[reserva.tipo]}

                        {/* 🔥 TOOLTIP */}
                        <div className="tooltip">
                          <strong>{textoTipo[reserva.tipo]}</strong>

                          {reserva.tipo === "partido" && reserva.jugadores && (
                            <div>
                              👥 {reserva.jugadores.join(", ")}
                            </div>
                          )}

                          {(reserva.tipo === "clase" ||
                            reserva.tipo === "adultos" ||
                            reserva.tipo === "menores") &&
                            reserva.monitor && (
                              <div>
                                👨‍🏫 Monitor: {reserva.monitor}
                              </div>
                          )}

                          <div>💰 {reserva.precio}€</div>
                          <div>
                            {reserva.pagado ? "✅ Pagado" : "❌ Pendiente"}
                          </div>
                        </div>
                      </>
                    ) : (
                      "Libre"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cuadrante;