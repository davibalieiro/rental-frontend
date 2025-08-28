import React from "react";

export default function TermosDeUso() {
  return (
    <div className="info-page">
      <h1>Termos de Uso</h1>
      <p>
        Bem-vindo ao nosso site! Ao acessar e utilizar nossos serviços, você concorda com os
        seguintes termos e condições. Leia atentamente.
      </p>

      <h2>1. Aceitação dos Termos</h2>
      <p>
        Ao utilizar a plataforma, o usuário declara estar ciente e de acordo com todos os pontos
        descritos neste documento. Caso não concorde, pedimos que interrompa o uso imediatamente.
      </p>

      <h2>2. Cadastro e Conta</h2>
      <p>
        Para utilizar algumas funcionalidades, é necessário criar uma conta com informações
        verdadeiras, completas e atualizadas. O usuário é responsável por manter a confidencialidade
        de sua senha.
      </p>

      <h2>3. Uso Permitido</h2>
      <p>
        O usuário compromete-se a utilizar os serviços apenas para fins legais e dentro dos limites
        previstos nestes termos, abstendo-se de práticas que possam prejudicar terceiros ou o bom
        funcionamento da plataforma.
      </p>

      <h2>4. Propriedade Intelectual</h2>
      <p>
        Todo o conteúdo disponível na plataforma, incluindo textos, imagens, logotipos, marcas e
        códigos, é de propriedade exclusiva da empresa e protegido por leis de direitos autorais.
      </p>

      <h2>5. Limitação de Responsabilidade</h2>
      <p>
        A empresa não se responsabiliza por danos causados pelo uso inadequado dos serviços ou por
        falhas externas, como indisponibilidade de rede ou ataques de terceiros.
      </p>

      <h2>6. Alterações nos Termos</h2>
      <p>
        Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento, sendo
        responsabilidade do usuário revisar periodicamente as atualizações.
      </p>

      <h2>7. Contato</h2>
      <p>
        Em caso de dúvidas, entre em contato conosco através do e-mail:{" "}
        <a href="mailto:suporte@seudominio.com">suporte@seudominio.com</a>.
      </p>

      <p className="last-update">
        Última atualização: {new Date().toLocaleDateString("pt-BR")}
      </p>
    </div>
  );
}
