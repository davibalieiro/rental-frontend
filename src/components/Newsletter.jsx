// src/components/Newsletter.jsx
import React from "react";

export default function Newsletter() {
  return (
    <section className="newsletter">
      <h3>Assine Nossa Newsletter</h3>
      <p>Receba novidades, ofertas e inspirações para seus eventos.</p>
      <form className="newsletter-form">
        <input type="email" placeholder="Digite seu email" />
        <button type="submit">Cadastrar</button>
      </form>
    </section>
  );
}
