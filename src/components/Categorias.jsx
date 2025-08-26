// src/components/Categories.jsx
import React from "react";
const categories = [
  { id: 1, name: "Chácaras", image: "https://picsum.photos/200/150?random=4" },
  { id: 2, name: "Salões", image: "https://picsum.photos/200/150?random=5" },
  { id: 3, name: "Sítios", image: "https://picsum.photos/200/150?random=6" },
];

export default function Categories() {
  return (
    <section className="categories">
      <h3>Categorias</h3>
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <img src={cat.image} alt={cat.name} />
            <h4>{cat.name}</h4>
          </div>
        ))}
      </div>
    </section>

  );
}
