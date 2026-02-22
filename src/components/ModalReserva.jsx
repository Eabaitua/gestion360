import "./ModalReserva.css";
import { useState } from "react";

function ModalReserva({ datos, onCerrar, onConfirmar }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  const [tipo, setTipo] = useState("partido");

  const [modoPago, setModoPago] = useState(""); // online o club
  const [metodoPago, setMetodoPago] = useState("tarjeta");

  const [titular, setTitular] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [cvv, setCvv] = useState("");
  const [telefonoBizum, setTelefonoBizum] = useState("");

  if (!datos) return null;

  const confirmar = () => {
    if (!nombre || !apellido) {
      alert("Completa nombre y apellido");
      return;
    }

    if (!modoPago) {
      alert("Selecciona cómo quieres pagar");
      return;
    }

    // 🔥 PAGO EN EL CLUB
    if (modoPago === "club") {
      onConfirmar(nombre, apellido, false, "Pendiente en club", tipo);
      return;
    }

    // 🔥 PAGO ONLINE
    if (modoPago === "online") {
      if (metodoPago === "tarjeta") {
        if (
          !titular ||
          numeroTarjeta.length < 12 ||
          !caducidad ||
          cvv.length < 3
        ) {
          alert("Completa correctamente los datos de la tarjeta");
          return;
        }
      }

      if (metodoPago === "bizum") {
        if (telefonoBizum.length < 9) {
          alert("Introduce un número válido para Bizum");
          return;
        }
      }

      onConfirmar(nombre, apellido, true, metodoPago, tipo);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Nueva Reserva</h2>

        <p><strong>Pista:</strong> {datos.pista}</p>
        <p><strong>Fecha:</strong> {datos.fecha}</p>
        <p><strong>Hora:</strong> {datos.hora}</p>
        <p><strong>Total:</strong> {datos.precio}€</p>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <h3>Tipo de reserva</h3>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="partido">🎾 Partido</option>
          <option value="clase">👨‍🏫 Clase particular</option>
          <option value="adultos">👥 Escuela adultos</option>
          <option value="menores">🧒 Escuela menores</option>
        </select>

        <h3>¿Cómo quieres pagar?</h3>

        <select
          value={modoPago}
          onChange={(e) => setModoPago(e.target.value)}
        >
          <option value="">Seleccionar opción</option>
          <option value="online">Pagar online</option>
          <option value="club">Pagar en el club</option>
        </select>

        {modoPago === "online" && (
          <>
            <h4>Método online</h4>

            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option value="tarjeta">Tarjeta</option>
              <option value="bizum">Bizum</option>
            </select>

            {metodoPago === "tarjeta" && (
              <>
                <input
                  type="text"
                  placeholder="Nombre del titular"
                  value={titular}
                  onChange={(e) => setTitular(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  value={numeroTarjeta}
                  onChange={(e) => setNumeroTarjeta(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="MM/AA"
                  value={caducidad}
                  onChange={(e) => setCaducidad(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </>
            )}

            {metodoPago === "bizum" && (
              <input
                type="text"
                placeholder="Número de teléfono Bizum"
                value={telefonoBizum}
                onChange={(e) => setTelefonoBizum(e.target.value)}
              />
            )}
          </>
        )}

        <div className="modal-buttons">
          <button onClick={onCerrar}>Cancelar</button>
          <button onClick={confirmar}>Confirmar reserva</button>
        </div>
      </div>
    </div>
  );
}

export default ModalReserva;