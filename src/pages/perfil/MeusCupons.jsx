import React from "react";
import "./css/MeusCupons.css";

function MeusCupons({ cupons, usarCupom }) {
  if (!cupons || cupons.length === 0) {
    return <p>Você não possui cupons disponíveis.</p>;
  }

  return (
    <div className="cupons-container">
      {cupons.map((cupom) => (
        <div key={cupom.id} className="cupom-card">
          <h4>{cupom.code}</h4>
          <p>{cupom.text}</p>
          <p>
            <strong>Benefício:</strong> {cupom.benefit}
          </p>
          <p>
            <strong>Expira em:</strong>{" "}
            {new Date(cupom.expiresIn).toLocaleDateString("pt-BR")}
          </p>
          <button onClick={() => usarCupom(cupom.code)}>Usar Cupom</button>
        </div>
      ))}
    </div>
  );
}

export default MeusCupons;
