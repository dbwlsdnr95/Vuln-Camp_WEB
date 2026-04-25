import { Container, Title, SimpleGrid, Text, Center } from '@mantine/core';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { products } from '@/data/products';
import Link from 'next/link';

export default function Home() {
  const featuredProducts = products;

  return (
    <>
      <Hero />
      <Container size="xl" py="xl" mt={80}>
        <Center mb={80}>
          <div style={{ textAlign: 'center' }}>
            <Text c="gray.6" fw={600} tt="uppercase" size="sm" mb="sm" style={{ letterSpacing: '3px' }}>Curated Collection</Text>
            <Title order={2} size="h1" fw={900} style={{ fontFamily: 'Outfit, sans-serif' }}>추천 장비</Title>
          </div>
        </Center>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing={40} verticalSpacing={80}>
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
              <ProductCard {...product} />
            </Link>
          ))}
        </SimpleGrid>

        <Center mt={120} mb={60}>
          <Text c="gray.4" size="sm" tt="uppercase" style={{ letterSpacing: '2px' }}>
            More Products Coming Soon
          </Text>
        </Center>
      </Container>
    </>
  );
}
