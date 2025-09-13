import React, { useState } from "react";
import "./css/MeusCupons.css";

function MeusCupons({ cupons }) {
  const [usedCupons, setUsedCupons] = useState([]);
  const [toast, setToast] = useState(null);

  const today = new Date();

  const isExpiringSoon = (expiresIn) => {
    const expDate = new Date(expiresIn);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  const usarCupom = (cupom) => {
    const code = cupom.code;
    if (!usedCupons.includes(code)) {
      setToast(`✅ Cupom "${code}" aplicado!`);
      setTimeout(() => setToast(null), 2500);
      setUsedCupons((prev) => [...prev, code]);
    }
  };

  if (!cupons || cupons.length === 0) {
    return <p>Você não possui cupons disponíveis.</p>;
  }

  // Ordenação de cupons ativos: primeiro expiring, depois por data
  const ativos = cupons
    .filter((c) => !usedCupons.includes(c.code))
    .sort((a, b) => {
      const aExp = isExpiringSoon(a.expiresIn);
      const bExp = isExpiringSoon(b.expiresIn);

      if (aExp && !bExp) return -1;
      if (!aExp && bExp) return 1;

      return new Date(a.expiresIn) - new Date(b.expiresIn);
    });

  // Cupons usados ordenados por data
  const usados = cupons
    .filter((c) => usedCupons.includes(c.code))
    .sort((a, b) => new Date(a.expiresIn) - new Date(b.expiresIn));

  return (
    <div className="cupons-wrapper">
      {toast && <div className="toast">{toast}</div>}

      {ativos.length > 0 && (
        <>
          <h2>Cupons disponíveis</h2>
          <div className="cupons-container">
            {ativos.map((cupom) => {
              const expiring = isExpiringSoon(cupom.expiresIn);
              return (
                <div
                  key={cupom.id}
                  className={`cupom-card ${expiring ? "expiring" : ""} fade-in`}
                >
                  {expiring && <span className="badge-alert">⚠️ Expira em breve</span>}
                  <h4>{cupom.code}</h4>
                  <p>{cupom.text}</p>
                  <p>
                    <strong>Benefício:</strong> {cupom.benefit}
                  </p>
                  <p>
                    <strong>Expira em:</strong>{" "}
                    {new Date(cupom.expiresIn).toLocaleDateString("pt-BR")}
                  </p>
                  </div>
              );
            })}
          </div>
        </>
      )}

    </div>
  );
}

export default MeusCupons;
