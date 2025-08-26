import React, { useState, useEffect, useRef } from "react";
import "./Carousel.css";

export default function Carousel() {
  const slides = [
    { id: 1, image: "https://picsum.photos/1200/400?random=1", title: "Chácara Primavera" },
    { id: 2, image: "https://picsum.photos/1200/400?random=2", title: "Salão Bela Vista" },
    { id: 3, image: "https://picsum.photos/1200/400?random=3", title: "Sítio Harmonia" },
  ];

  const [current, setCurrent] = useState(0);
  const startX = useRef(0);
  const endX = useRef(0);

  // Auto-play a cada 4s
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Funções de Swipe (Mobile)
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    endX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!startX.current || !endX.current) return;
    const diff = startX.current - endX.current;

    if (diff > 50) {
      // swipe left
      nextSlide();
    } else if (diff < -50) {
      // swipe right
      prevSlide();
    }

    startX.current = 0;
    endX.current = 0;
  };

  return (
    <section
      className="carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="carousel-slide">
            <img src={slide.image} alt={slide.title} />
            <div className="carousel-overlay">
              <h2>{slide.title}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Botões */}
      <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
      <button className="carousel-btn next" onClick={nextSlide}>›</button>

      {/* Indicadores */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? "active" : ""}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}
