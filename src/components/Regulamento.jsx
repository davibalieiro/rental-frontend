import React from "react";

export default function Regulamento() {
  return (
    <div className="info-page">
      <h1>Regulamento</h1>
      <p>
        Este regulamento estabelece as regras de participação, promoções e uso
        dos serviços oferecidos pela nossa plataforma.
      </p>

      <h2>1. Participação</h2>
      <p>
        Qualquer pessoa maior de 18 anos pode utilizar nossos serviços,
        respeitando as condições aqui descritas.
      </p>

      <h2>2. Promoções</h2>
      <p>
        As promoções são válidas apenas dentro do período especificado e estão
        sujeitas à disponibilidade de produtos.
      </p>

      <h2>3. Conduta do Usuário</h2>
      <p>
        É proibido utilizar a plataforma para fins ilegais, ofensivos ou que
        prejudiquem terceiros.
      </p>

      <h2>4. Penalidades</h2>
      <p>
        O descumprimento das regras pode resultar em suspensão ou exclusão da
        conta sem aviso prévio.
      </p>

      <p className="last-update">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}
