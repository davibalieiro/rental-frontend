import React from "react";
import "./css/Empresa.css";

export default function Empresa() {
  return (
    <div className="empresa-container">
      <h1>Sobre a Empresa</h1>

      <section className="empresa-section">
        <h2>Quem Somos</h2>
        <p>
          Somos uma empresa comprometida em oferecer produtos e serviços de
          qualidade, sempre buscando inovação e excelência no atendimento ao
          cliente. Nosso objetivo é criar soluções que facilitem o dia a dia
          das pessoas.
        </p>
      </section>

      <section className="empresa-section">
        <h2>Missão</h2>
        <p>
          Proporcionar aos nossos clientes a melhor experiência, garantindo
          qualidade, preço justo e atendimento diferenciado.
        </p>
      </section>

      <section className="empresa-section">
        <h2>Visão</h2>
        <p>
          Ser referência no mercado nacional, expandindo nossas soluções para
          alcançar cada vez mais pessoas.
        </p>
      </section>

      <section className="empresa-section">
        <h2>Valores</h2>
        <ul>
          <li>✔ Ética e Transparência</li>
          <li>✔ Inovação</li>
          <li>✔ Compromisso com o Cliente</li>
          <li>✔ Sustentabilidade</li>
        </ul>
      </section>

      <section className="empresa-section">
        <h2>Onde Estamos</h2>
        <p>
          Rua Exemplo, 123 - Centro <br />
          São Paulo - SP <br />
          Telefone: (11) 99999-9999
        </p>
      </section>
    </div>
  );
}
