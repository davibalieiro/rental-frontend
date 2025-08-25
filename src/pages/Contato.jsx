export default function Contato() {
  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Fale Conosco</h1>
      <form className="grid gap-4">
        <input type="text" placeholder="Seu nome" className="border p-2 rounded"/>
        <input type="email" placeholder="Seu e-mail" className="border p-2 rounded"/>
        <textarea placeholder="Sua mensagem" rows="4" className="border p-2 rounded"></textarea>
        <button className="bg-green-600 text-white py-2 rounded hover:bg-red-600">
          Enviar
        </button>
      </form>
    </section>
  );
}
