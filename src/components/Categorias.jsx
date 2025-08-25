// src/components/Categories.jsx
import React from "react";
const categories = [
  { id: 1, name: "Chácaras", image: "https://picsum.photos/200/150?random=4" },
  { id: 2, name: "Salões", image: "https://picsum.photos/200/150?random=5" },
  { id: 3, name: "Sítios", image: "https://picsum.photos/200/150?random=6" },
];

export default function Categories() {
  return (
    <section id="catalogo" className="py-16 px-6 text-center">
      <h3 className="text-3xl font-bold text-[#FF4500] mb-8">Categorias</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white shadow-md rounded-lg p-4">
            <img src={cat.image} alt={cat.name} className="w-full h-40 object-cover rounded-md" />
            <h4 className="mt-4 text-xl font-semibold text-[#32CD32]">{cat.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
