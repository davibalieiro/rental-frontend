import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/MeusCupons.css";

function MeusCupons({ cupons }) {
  const navigate = useNavigate();
  const [usedCupons, setUsedCupons] = useState([]);
  const [toast, setToast] = useState(null);

  const usarCupom = (cupom) => {
    const code = cupom.code;
    if (!usedCupons.includes(code)) {
      // Mostra toast
      setToast(`✅ Cupom "${code}" aplicado!`);
      setTimeout(() => setToast(null), 2500);

      // Move cupom para usados
      setUsedCupons((prev) => [...prev, code]);

      // Redireciona após 1s
      setTimeout(() => navigate("/catalogo"), 1000);
    }
  };

  if (!cupons || cupons.length === 0) {
    return <p>Você não possui cupons disponíveis.</p>;
  }

  const today = new Date();
  const ativos = cupons.filter((c) => !usedCupons.includes(c.code));
  const usados = cupons.filter((c) => usedCupons.includes(c.code));

  const isExpiringSoon = (expiresIn) => {
    const expDate = new Date(expiresIn);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <div className="cupons-wrapper">
      {toast && <div className="toast">{toast}</div>}

      {ativos.length > 0 && (
        <>
          <h3>Cupons disponíveis</h3>
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
                  <button onClick={() => usarCupom(cupom)}>Usar Cupom</button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {usados.length > 0 && (
        <>
          <h3>Cupons usados</h3>
          <div className="cupons-container">
            {usados.map((cupom) => (
              <div key={cupom.id} className="cupom-card used fade-in">
                <h4>{cupom.code}</h4>
                <p>{cupom.text}</p>
                <p>
                  <strong>Benefício:</strong> {cupom.benefit}
                </p>
                <p>
                  <strong>Expira em:</strong>{" "}
                  {new Date(cupom.expiresIn).toLocaleDateString("pt-BR")}
                </p>
                <button disabled>Cupom usado</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MeusCupons;
