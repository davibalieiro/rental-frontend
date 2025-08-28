import React, { useState } from "react";
import "./css/Contato.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        setStatus("Erro ao enviar mensagem.");
        return;
      }

      setStatus("Mensagem enviada com sucesso!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("Erro ao conectar com servidor.");
    }
  };
  return (
    <section className="contact-section">
      <h3>Como você prefere falar com a gente?</h3>
      <div className="contact-options">

        <div className="contact-card">
          <FontAwesomeIcon icon={faEnvelope} size="3x" color="#ff4500" />
          <h4>E-mail</h4>
          <p>Tem alguma dúvida?</p>
          <a href="mailto:meajuda@instbank.com.br">meajuda@instbank.com.br</a>
        </div>

        <div className="contact-card">
          <FontAwesomeIcon icon={faPhone} size="3x" color="#ff4500" />
          <h4>Telefone</h4>
          <p>Você pode ligar a qualquer hora.</p>
          <strong>0800 591 2917</strong>
        </div>

        <div className="contact-card">
          <FontAwesomeIcon icon={faInstagram} size="3x" color="#ff4500" />
          <h4>Instagram</h4>
          <p>Siga e fale com a gente.</p>
          <a href="https://instagram.com/seuperfil" target="_blank" rel="noopener noreferrer">
            @seuperfil
          </a>
        </div>

        <div className="contact-card">
          <FontAwesomeIcon icon={faFacebook} size="3x" color="#ff4500" />
          <h4>Facebook</h4>
          <p>Nos encontre no Facebook.</p>
          <a href="https://facebook.com/seupagina" target="_blank" rel="noopener noreferrer">
            facebook.com/seupagina
          </a>
        </div>

        <div className="contact-card">
          <FontAwesomeIcon icon={faWhatsapp} size="3x" color="#ff4500" />
          <h4>WhatsApp</h4>
          <p>Fale com a gente pelo zap.</p>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
            (11) 99999-9999
          </a>
        </div>

        <div className="contact-card">
          <FontAwesomeIcon icon={faMapMarkerAlt} size="3x" color="#ff4500" />
          <h4>Local</h4>
          <p>Venha nos visitar.</p>
          <a href="https://www.google.com/maps?q=-23.561684,-46.655981" target="_blank" rel="noopener noreferrer">
            Av. Paulista, 1000 - São Paulo, SP
          </a>
        </div>
      </div>
    </section>
  );
}