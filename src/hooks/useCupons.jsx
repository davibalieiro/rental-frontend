import { useState, useEffect } from "react";

export function useCupons(user, token) {
  const [cupons, setCupons] = useState([]);
  const [loadingCupons, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchCupons() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/api/coupons/my", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // garante que tá autenticado
          },
        });

        if (!res.ok) {
          throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setCupons(data.data || []);
      } catch (err) {
        console.error("Erro ao carregar cupons:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCupons();
  }, [user, token]);

  return { cupons, loadingCupons, error };
}
