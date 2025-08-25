// src/components/Carousel.jsx
import React from "react";
export default function Carousel() {
  const slides = [
    { id: 1, image: "https://picsum.photos/1200/400?random=1", title: "Chácara Primavera" },
    { id: 2, image: "https://picsum.photos/1200/400?random=2", title: "Salão Bela Vista" },
    { id: 3, image: "https://picsum.photos/1200/400?random=3", title: "Sítio Harmonia" },
  ];

  return (
    <section className="overflow-hidden relative">
      <div className="flex transition-transform duration-500">
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full relative">
            <img src={slide.image} alt={slide.title} className="w-full h-[400px] object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-white text-3xl font-bold">{slide.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
