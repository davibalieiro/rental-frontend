import { useState, useEffect } from "react";

export function useCupons(user) {
  const [cupons, setCupons] = useState([]);
  const [loadingCupons, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function fetchCupons() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3000/api/coupons/my", {
          credentials: "include"
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
  }, [user]);

  return { cupons, loadingCupons, error };
}
