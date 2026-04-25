'use client';

import { Button, Group } from '@mantine/core';
import { useCart } from '../context/CartContext';
import { notifications } from '@mantine/notifications';

import { useRouter } from 'next/navigation';

export default function AddToCartButton({ product }: { product: any }) {
    const { addItem, clearCart } = useCart();
    const router = useRouter();

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category
        }); // Default true, so drawer opens
        notifications.show({
            title: '장바구니에 담겼습니다',
            message: '장바구니에서 확인해주세요.',
            color: 'green',
        });
    };

    const handleBuyNow = () => {
        clearCart(); // Clear existing cart items for direct purchase
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category
        }, false); // Pass false to prevent drawer from opening
        router.push('/checkout');
    };

    return (
        <Group grow gap="xs">
            <Button
                size="xl"
                variant="outline"
                color="dark"
                radius="xs"
                onClick={handleAddToCart}
            >
                장바구니 담기
            </Button>
            <Button
                size="xl"
                color="dark"
                radius="xs"
                onClick={handleBuyNow}
            >
                구매하기
            </Button>
        </Group>
    );
}
