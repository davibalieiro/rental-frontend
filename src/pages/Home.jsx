import React from "react";
import Carousel from "../components/Carousel";
import Categories from "../components/Categorias"
import Highlights from "../components/Highlights";
import ContactForm from "../components/ContactForm";

export default function Home() {
  return (
    <div>
      <Carousel />
      <Categories />
      <Highlights />
      <ContactForm />
    </div>
  );
}
