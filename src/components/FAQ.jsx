import React from "react";

export default function FAQ() {
  const faqs = [
    {
      q: "Como faço meu cadastro?",
      a: "Basta acessar a página de registro, preencher seus dados e confirmar por e-mail.",
    },
    {
      q: "Posso alterar meus dados depois?",
      a: "Sim. No painel do usuário você pode atualizar informações pessoais e senha.",
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "Cartão de crédito, boleto, Pix e outras opções disponíveis no checkout.",
    },
    {
      q: "O suporte funciona em quais horários?",
      a: "Nosso suporte funciona de segunda a sexta, das 9h às 18h.",
    },
  ];

  return (
    <div className="info-page">
      <h1>Perguntas Frequentes (FAQ)</h1>
      {faqs.map((item, idx) => (
        <div key={idx} className="faq-item">
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}
    </div>
  );
}
