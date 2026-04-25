'use client';

import { Container, Title, SimpleGrid, Card, Image, Text, AspectRatio, Badge, Group } from '@mantine/core';

const articles = [
    {
        title: '겨울 캠핑의 낭만과 필수 장비 가이드',
        image: '/images/stories/winter-story.png',
        date: 'Dec 12, 2024',
        category: 'Guide',
        excerpt: '영하의 추위에서도 따뜻하고 안전하게 캠핑을 즐기는 방법을 소개합니다. 난방 기구 사용법부터 결로 방지 팁까지.'
    },
    {
        title: 'VULN CAMP가 제안하는 미니멀 캠핑',
        image: '/images/stories/minimal-story.png',
        date: 'Nov 28, 2024',
        category: 'Lifestyle',
        excerpt: '더 적게 소유하고, 더 많이 경험하세요. 최소한의 장비로 자연과 하나되는 미니멀 캠핑의 매력.'
    },
    {
        title: '새로운 돔 텐트 개발 비하인드 스토리',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: 'Nov 15, 2024',
        category: 'Brand',
        excerpt: '1년의 테스트 기간, 50번의 프로토타입. 완벽한 돔 텐트를 만들기 위한 개발지들의 치열했던 기록.'
    },
    {
        title: '숲속에서의 아침 식사 레시피',
        image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        date: 'Oct 30, 2024',
        category: 'Food',
        excerpt: '화로대 하나로 만드는 근사한 브런치. 간단하지만 맛있는 캠핑 요리 레시피를 공개합니다.'
    },
];

export default function StoriesPage() {
    return (
        <Container size="xl" py={80}>
            <Title order={1} mb={60} ta="center" style={{ fontFamily: 'Outfit, sans-serif' }}>STORIES</Title>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={50}>
                {articles.map((article) => (
                    <Card key={article.title} padding="lg" radius="md" component="a" href="#" className="story-card" style={{ cursor: 'pointer' }}>
                        <Card.Section>
                            <AspectRatio ratio={16 / 9}>
                                <Image src={article.image} alt={article.title} />
                            </AspectRatio>
                        </Card.Section>

                        <Group justify="space-between" mt="md" mb="xs">
                            <Badge color="gray" variant="light">{article.category}</Badge>
                            <Text size="xs" c="dimmed">{article.date}</Text>
                        </Group>

                        <Text fw={700} size="xl" mt="xs" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {article.title}
                        </Text>

                        <Text size="sm" c="dimmed" mt="xs" lineClamp={2}>
                            {article.excerpt}
                        </Text>
                    </Card>
                ))}
            </SimpleGrid>
        </Container>
    );
}
