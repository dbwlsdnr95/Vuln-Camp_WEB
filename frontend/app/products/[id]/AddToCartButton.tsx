'use client';

import { Button } from '@mantine/core';
import { useCart } from '@/context/CartContext';
import { notifications } from '@mantine/notifications'; // Optional for future

export default function AddToCartButton({ product }: { product: any }) {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category
        });
    };

    return (
        <Button
            fullWidth
            size="xl"
            color="dark"
            radius="xs"
            onClick={handleAddToCart}
        >
            Add to Cart
        </Button>
    );
}
