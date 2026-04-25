'use client';

import { Container, Title, SimpleGrid, Text, Center } from '@mantine/core';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import Link from 'next/link';

export default function ShopPage() {
    return (
        <Container size="xl" py="xl" mt={80}>
            <Center mb={50}>
                <div style={{ textAlign: 'center' }}>
                    <Text c="gray.6" fw={600} tt="uppercase" size="sm" mb="sm" style={{ letterSpacing: '3px' }}>Shop All</Text>
                    <Title order={2} size="h1" fw={900} style={{ fontFamily: 'Outfit, sans-serif' }}>전체 상품</Title>
                </div>
            </Center>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={40} verticalSpacing={80}>
                {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                        <ProductCard {...product} />
                    </Link>
                ))}
            </SimpleGrid>
        </Container>
    );
}
