import { apiFetch } from "@/lib/api";

export default async function HomePage() {
  const { data: products } = await apiFetch("/product/all");

  return (
    <main className="container">
      <h1>Catálogo de Produtos</h1>
      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            <h2>{p.name}</h2>
            <p>Categoria: {p.category?.name}</p>
            <p>Material: {p.material?.name}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
