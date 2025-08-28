import React from "react";
import { Link } from "react-router-dom"; // SPA navigation
import "../index.css";

export default function InfoCards() {
  const infos = [
    {
      title: "Termos de Uso",
      desc: "Confira nossos termos de uso e saiba como funcionam nossas regras.",
      link: "/termos",
    },
    {
      title: "Política de Privacidade",
      desc: "Entenda como cuidamos dos seus dados e garantimos sua segurança.",
      link: "/privacidade",
    },
    {
      title: "FAQ",
      desc: "Veja as perguntas mais frequentes e encontre respostas rápidas.",
      link: "/faq",
    },
    {
      title: "Regulamento",
      desc: "Leia o regulamento completo dos nossos serviços e promoções.",
      link: "/regulamento",
    },
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
