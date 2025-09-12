import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Menu */}
        <div>
          <h4>Menu</h4>
          <ul>
            <li><Link to="/empresa">Empresa</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </div>

        {/* Horário */}
        <div>
          <h4><FaClock /> Horário</h4>
          <p>Seg - Sex: 9h às 18h</p>
          <p>Sáb: 9h às 14h</p>
          <p>Dom: Fechado</p>
        </div>

        {/* Contatos */}
        <div>
          <h4>Contatos</h4>
          <p><FaEnvelope /> contato@clisare.com</p>
          <p><FaPhone /> (11) 99999-9999</p>
        </div>

        {/* Endereço + Mapa */}
        <div>
          <h4><FaMapMarkerAlt /> Endereço</h4>
          <p>
            Rua Betty Hass de Campos, 220<br />
            Colina de Indaiatuba - SP
          </p>
          <iframe
            title="Mapa Clisare"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.906063615361!2d-47.21288452384679!3d-23.574599362047263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf3b3e6e65a8f7%3A0x1111111111111111!2sRua%20Betty%20Hass%20de%20Campos%2C%20220%20-%20Colina%20de%20Indaiatuba!5e0!3m2!1spt-BR!2sbr!4v1694444444444!5m2!1spt-BR!2sbr"
            width="100%"
            height="150"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Clisare Locações e Eventos</p>
      </div>
    </footer>
  );
}
