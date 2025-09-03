import { useState, useEffect } from "react";


export function useProductImages(products) {
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            let urls = {};
            for (const product of products) {
                if (product.img_blob_name) {
                    try {
                        const res = await fetch(`http://localhost:3000/api/product/${product.id}/image`, {
                            credentials: "include",
                        });
                        const data = await res.json();

                        urls[product.id] = data.sasToken;
                        continue;
                    } catch (err) {
                        console.error(err);
                    }
                }

                urls[product.id] = null;

            }
            setImageUrls(urls);
        };

        if (products.length > 0) {
            fetchImages();
        }
    }, [products]);

    return { imageUrls };
}

export function useProductImage(product) {
    const [productImgUrl, setProductImgUrl] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            if (product?.img_blob_name) {
                try {
                    const res = await fetch(
                        `http://localhost:3000/api/product/${product.id}/image`,
                        { credentials: "include" }
                    );
                    const data = await res.json();
                    setProductImgUrl(data.sasToken);
                } catch (err) {
                    console.error("Erro carregando imagem:", err);
                    setProductImgUrl("https://via.placeholder.com/400x400"); // fallback
                }
            }
        };

        fetchImages();
    }, [product]);

    return { productImgUrl };
}
