import React from "react";
import { Link } from "react-router-dom";
import "../pages/css/InfoCard.css";

export default function InfoCards() {
  const infos = [
    { title: "Termos de Uso", desc: "Confira nossos termos de uso...", link: "/termos" },
    { title: "Política de Privacidade", desc: "Entenda como cuidamos dos seus dados...", link: "/privacidade" },
    { title: "FAQ", desc: "Veja as perguntas mais frequentes...", link: "/faq" },
    { title: "Regulamento", desc: "Leia o regulamento completo...", link: "/regulamento" },
  ];

  return (
    <section className="info-section">
      {infos.map((item, idx) => (
        <div key={idx} className="info-card">
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
          <Link to={item.link}>Saiba mais</Link>
        </div>
      ))}
    </section>
  );
}
