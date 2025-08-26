// src/components/Highlights.jsx
import React from "react";

export default function Highlights() {
  const items = [
    { id: 1, title: "Decoração de Casamento", image: "https://picsum.photos/300/200?random=10" },
    { id: 2, title: "Chácaras Exclusivas", image: "https://picsum.photos/300/200?random=11" },
    { id: 3, title: "Salões Modernos", image: "https://picsum.photos/300/200?random=12" },
  ];

  return (
    <section className="highlights">
      <h3>Destaques</h3>
      <div className="highlights-grid">
        {items.map((item) => (
          <div key={item.id} className="highlight-card">
            <img src={item.image} alt={item.title} />
            <h4>{item.title}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
