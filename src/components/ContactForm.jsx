// src/components/ContactForm.jsx
export default function ContactForm() {
  return (
    <section id="contato" className="py-16 px-6 text-center">
      <h3 className="text-3xl font-bold text-[#FF4500] mb-8">Fale Conosco</h3>
      <form className="max-w-lg mx-auto grid gap-4">
        <input type="text" placeholder="Seu nome" className="p-3 border rounded-md" />
        <input type="email" placeholder="Seu email" className="p-3 border rounded-md" />
        <textarea placeholder="Sua mensagem" className="p-3 border rounded-md" rows="5"></textarea>
        <button className="px-6 py-3 bg-[#32CD32] text-white font-semibold rounded-lg hover:bg-green-600 transition">
          Enviar
        </button>
      </form>
    </section>
  );
}
