"use client";
import { Container, Group, ActionIcon, Text, Anchor, Stack } from '@mantine/core';
import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer style={{ marginTop: 120, borderTop: '1px solid var(--mantine-color-gray-2)', paddingTop: 60, paddingBottom: 60, backgroundColor: 'var(--mantine-color-gray-0)' }}>
            <Container size="md">
                <Group justify="space-between" align="start">
                    <Stack gap="xs">
                        <Text fw={900} size="lg" variant="gradient" gradient={{ from: 'forest-green.7', to: 'teal.8', deg: 90 }}>
                            VULN CAMP
                        </Text>
                        <Text size="sm" c="dimmed" maw={300} style={{ wordBreak: 'keep-all' }}>
                            현대인을 위한 프리미엄 캠핑 기어. <br />
                            자연 속에서의 편안함과 스타일을 경험하세요.
                        </Text>
                    </Stack>

                    <Stack gap="xs">
                        <Text fw={700} mb={5}>쇼핑</Text>
                        <Anchor component={Link} href="/products" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>전체 상품</Anchor>
                        <Anchor component={Link} href="/tents" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>텐트</Anchor>
                        <Anchor component={Link} href="/gear" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>장비</Anchor>
                    </Stack>

                    <Stack gap="xs">
                        <Text fw={700} mb={5}>회사</Text>
                        <Anchor component={Link} href="/about" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>소개</Anchor>
                        <Anchor component={Link} href="/contact" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>문의하기</Anchor>
                        <Anchor component={Link} href="/terms" c="dimmed" size="sm" style={{ textDecoration: 'none' }}>이용약관</Anchor>
                    </Stack>

                    <Group gap="xs">
                        <ActionIcon size="lg" color="gray" variant="subtle">
                            <IconBrandInstagram size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" color="gray" variant="subtle">
                            <IconBrandTwitter size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon size="lg" color="gray" variant="subtle">
                            <IconBrandYoutube size={18} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </Group>
                <Text c="dimmed" size="xs" ta="center" mt={60}>
                    © 2025 Vuln Camp. All rights reserved.
                </Text>
            </Container>
        </footer>
    );
}
