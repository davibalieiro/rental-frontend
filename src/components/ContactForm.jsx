import React from "react";

export default function ContactForm() {
  return (
    <section id="contato" className="contact-section">
      <h3>Fale Conosco</h3>
      <form className="contact-form">
        <input type="text" placeholder="Seu nome" />
        <input type="email" placeholder="Seu email" />
        <textarea placeholder="Sua mensagem" rows="5"></textarea>
        <button type="submit">Enviar</button>
      </form>
    </section>
  );
}
