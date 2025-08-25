export default function Catalogo() {
  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Catálogo de Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Exemplo de item */}
        <div className="border rounded-xl shadow-md p-4 hover:shadow-lg transition">
          <img src="https://via.placeholder.com/300" alt="Produto" className="rounded mb-3"/>
          <h2 className="font-bold text-lg">Cadeira de Evento</h2>
          <p className="text-gray-600">Confortável e prática para qualquer ocasião.</p>
        </div>
      </div>
    </section>
  );
}
