import React from "react";
import { Link } from "react-router";

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

        {/* Horários */}
        <div>
          <h4>Horário</h4>
          <p>Seg - Sex: 9h às 18h</p>
          <p>Sáb: 9h às 14h</p>
          <p>Dom: Fechado</p>
        </div>

        {/* Contatos */}
        <div>
          <h4>Contatos</h4>
          <p>Email: contato@clisare.com</p>
          <p>Tel: (11) 99999-9999</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Clisare Locações e Eventos</p>
      </div>
    </footer>
  );
}
