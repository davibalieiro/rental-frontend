// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#32CD32] text-white py-12 px-6">
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contatos */}
        <div>
          <h4 className="font-bold text-lg mb-3">Contatos</h4>
          <p>Email: contato@clisare.com</p>
          <p>Telefone: (11) 99999-9999</p>
        </div>

        {/* Novidades */}
        <div>
          <h4 className="font-bold text-lg mb-3">Novidades</h4>
          <p>Cadastre-se e receba ofertas exclusivas.</p>
          <div className="flex mt-3">
            <input
              type="email"
              placeholder="Seu email"
              className="p-2 w-full rounded-l-md text-black"
            />
            <button className="px-4 bg-[#FF4500] rounded-r-md">Enviar</button>
          </div>
        </div>

        {/* Horários */}
        <div>
          <h4 className="font-bold text-lg mb-3">Horários</h4>
          <p>Seg - Sex: 9h às 18h</p>
          <p>Sáb: 9h às 14h</p>
          <p>Dom: Fechado</p>
        </div>
      </div>
      <p className="text-center mt-10">&copy; {new Date().getFullYear()} Clisare Locações e Eventos</p>
    </footer>
  );
}
