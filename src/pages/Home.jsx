import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
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
