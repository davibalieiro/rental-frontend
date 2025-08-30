import React from 'react';
import '../index.css'; // Crie este arquivo CSS

export default () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1>404</h1>
        <p>Página não encontrada</p>
        <a href="/" className="notfound-button">Voltar para o início</a>
      </div>
    </div>
  );
};
