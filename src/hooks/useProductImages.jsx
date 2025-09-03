import { useState, useEffect } from "react";

export function useProductImages(products) {

    const [imageUrls, setImageUrls] = useState({});
    useEffect(() => {
        const fetchImages = async () => {
            let urls = {};
            for (const product of products) {
                try {
                    const res = await fetch(`http://localhost:3000/api/product/${product.id}/image`, {
                        credentials: "include",
                    });
                    const data = await res.json();
                    urls[product.id] = data.sasToken;
                } catch (err) {
                    urls[product.id] = "https://via.placeholder.com/300x200";
                }
            }
            setImageUrls(urls);
        };

        if (products.length > 0) {
            fetchImages();
        }
    }, [products]);

    return { imageUrls }

}