import { Container, Image, Title, Text, Button, Group, Badge, Breadcrumbs, Anchor } from '@mantine/core';
import { products } from '@/data/products';
import { notFound } from 'next/navigation';
import AddToCartButton from '../../../components/AddToCartButton';
import Link from 'next/link';

// Generate static params for all products
export async function generateStaticParams() {
    return products.map((product) => ({
        id: product.id,
    }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    const items = [
        { title: '홈', href: '/' },
        { title: '상품', href: '/products' },
        { title: product.title, href: '#' },
    ].map((item, index) => (
        <Link href={item.href} key={index} style={{ textDecoration: 'none', color: 'gray', fontSize: '14px' }}>
            {item.title}
        </Link>
    ));

    return (
        <Container size="xl" py={80}>
            <Breadcrumbs mb="xl">{items}</Breadcrumbs>

            <div style={{ display: 'flex', gap: '60px', flexDirection: 'row', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 400px' }}>
                    <Image src={product.image} radius="sm" alt={product.title} w="100%" />
                </div>
                <div style={{ flex: '1 1 300px' }}>
                    <Text tt="uppercase" c="dimmed" fw={700} size="sm" mb="sm">
                        {product.category}
                    </Text>
                    <Title order={1} mb="md" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {product.title}
                    </Title>
                    <Text size="xl" fw={700} mb="xl">
                        {product.price.toLocaleString()}원
                    </Text>

                    <Text c="dimmed" mb={40} style={{ lineHeight: 1.6 }}>
                        {product.description}
                    </Text>

                    <AddToCartButton product={product} />

                    <Group mt={50}>
                        <Badge variant="light" color="gray" size="lg" radius="xs">빠른 배송</Badge>
                        <Badge variant="light" color="gray" size="lg" radius="xs">공식 보증</Badge>
                    </Group>
                </div>
            </div>
        </Container>
    );
}
