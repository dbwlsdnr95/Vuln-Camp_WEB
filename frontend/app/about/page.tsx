'use client';

import { Container, Title, Text, SimpleGrid, Image, ThemeIcon, rem, Stack } from '@mantine/core';
import { IconMountain, IconCampfire, IconLeaf, IconShieldCheck } from '@tabler/icons-react';
import { Hero } from '@/components/Hero';

export default function AboutPage() {
    return (
        <Container size="xl" py={80}>
            <Stack gap="xl" align="center" mb={80}>
                <Text c="dimmed" tt="uppercase" fw={700} style={{ letterSpacing: '2px' }}>Since 2024</Text>
                <Title order={1} size={48} ta="center" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    We are VULN CAMP
                </Title>
                <Text c="dimmed" ta="center" maw={600} size="lg">
                    자연과 가장 가까운 곳에서, 가장 안전하고 편안한 휴식을 제공하는 것이 우리의 사명입니다.
                    우리는 단순히 캠핑 장비를 파는 것이 아니라, 자연 속에서의 경험을 디자인합니다.
                </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80} verticalSpacing={80}>
                <Image src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" radius="md" />
                <Stack justify="center">
                    <Title order={2} mb="md" style={{ fontFamily: 'Outfit, sans-serif' }}>Philosophy</Title>
                    <Text c="dimmed" size="lg" style={{ lineHeight: 1.6 }}>
                        우리는 '미니멀리즘'과 '기능성'의 조화를 추구합니다. 불필요한 장식은 걷어내고, 본연의 기능에 충실하면서도 아름다움을 잃지 않는 장비를 만듭니다. 모든 제품은 실제 캠퍼들의 피드백을 통해 탄생하며, 혹독한 환경에서도 당신을 지켜줄 것입니다.
                    </Text>
                </Stack>

                <Image src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" radius="md" />
                <Stack justify="center">
                    <Title order={2} mb="md" style={{ fontFamily: 'Outfit, sans-serif' }}>Sustainability</Title>
                    <Text c="dimmed" size="lg" style={{ lineHeight: 1.6 }}>
                        자연을 사랑하는 만큼, 자연을 지키는 일에도 앞장섭니다. 우리는 지속 가능한 소재를 사용하고, 수리 가능한 설계를 통해 제품의 수명을 늘립니다. 캠핑이 자연을 훼손하는 행위가 아닌, 자연과 공존하는 방식이 되도록 노력합니다.
                    </Text>
                </Stack>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={50} mt={120}>
                <Feature icon={IconMountain} title="Nature First" description="자연 친화적 소재와 제조 공정을 준수합니다." />
                <Feature icon={IconShieldCheck} title="Lifetime Warranty" description="제조 결함에 대해 평생 보증을 제공합니다." />
                <Feature icon={IconCampfire} title="Community" description="모든 캠퍼들과 지식과 경험을 공유합니다." />
            </SimpleGrid>
        </Container>
    );
}

function Feature({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div>
            <ThemeIcon variant="light" size={60} radius="md" color="gray" mb="md">
                <Icon style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
            </ThemeIcon>
            <Text fw={700} fz="lg" mb="sm">{title}</Text>
            <Text c="dimmed" fz="sm" style={{ lineHeight: 1.6 }}>{description}</Text>
        </div>
    );
}
