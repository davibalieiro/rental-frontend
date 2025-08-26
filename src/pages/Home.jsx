import React from "react";
import Carousel from "../components/Carousel";
import Categories from "../components/Categorias";
import Highlights from "../components/Highlights";
import Newsletter from "../components/Newsletter";
import ContactForm from "../components/ContactForm";

export default function Home() {
  return (
    <main>
      {/* Hero / Carousel */}
      <Carousel />

      {/* Categorias */}
      <Categories />

      {/* Destaques */}
      <Highlights />

      {/* Newsletter */}
      <Newsletter />

      {/* Contato */}
      <ContactForm />
    </main>
  );
}
