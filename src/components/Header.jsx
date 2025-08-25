import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Clisare Logo" className="h-12" />
      </div>

      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="text-gray-700 hover:text-[#FF4500] font-semibold">Home</Link>
        <Link to="/empresa" className="text-gray-700 hover:text-[#FF4500]">Empresa</Link>
        <Link to="/catalogo" className="text-gray-700 hover:text-[#FF4500]">Catálogo</Link>
        <Link to="/contato" className="text-gray-700 hover:text-[#FF4500]">Contato</Link>
      </nav>

      <Link
        to="/login"
        className="px-5 py-2 bg-[#32CD32] text-white font-semibold rounded-lg hover:bg-green-600 transition"
      >
        Login
      </Link>
    </header>
  );
}
