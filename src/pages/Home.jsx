import React from "react";
import Carousel from "../components/Carousel";
import Categories from "../components/Categorias";
import Highlights from "../components/Highlights";
import Newsletter from "../components/Newsletter";
import InfoCard from "../components/InfoCard";

export default function Home() {
  return (
    <main>

      {/* Hero / Carousel */}
      <Carousel />

      {/* Destaques */}
      <Highlights />

      {/* Categorias */}
      <Categories />

      {/* Newsletter */}
      <Newsletter />

      {/* InfoCard */}
      <InfoCard />
    </main>
  );
}
