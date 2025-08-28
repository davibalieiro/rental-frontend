import React from "react";

export default function Privacidade() {
  return (
    <div className="info-page">
      <h1>Política de Privacidade</h1>
      <p>
        Nós respeitamos sua privacidade e garantimos a proteção dos seus dados
        pessoais. Este documento descreve como coletamos, usamos e protegemos
        suas informações.
      </p>

      <h2>1. Coleta de Dados</h2>
      <p>
        Coletamos apenas os dados necessários para o funcionamento da
        plataforma, como nome, e-mail e telefone informados no cadastro.
      </p>

      <h2>2. Uso das Informações</h2>
      <p>
        Utilizamos seus dados para autenticação, comunicação e melhorias dos
        serviços. Nunca venderemos suas informações a terceiros.
      </p>

      <h2>3. Armazenamento e Segurança</h2>
      <p>
        Seus dados são armazenados em servidores seguros e utilizamos
        criptografia para proteger informações sensíveis.
      </p>

      <h2>4. Direitos do Usuário</h2>
      <p>
        Você pode solicitar a atualização ou exclusão dos seus dados a qualquer
        momento através do nosso suporte.
      </p>

      <p className="last-update">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}
