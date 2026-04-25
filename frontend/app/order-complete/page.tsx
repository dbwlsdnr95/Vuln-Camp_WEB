'use client';

import { Container, Title, Button, Text, Center, Stack, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

export default function OrderCompletePage() {
    return (
        <Container size="sm" py={80} mt={80}>
            <Center>
                <ThemeIcon radius="xl" size={80} color="green" mb="xl">
                    <IconCheck style={{ width: rem(40), height: rem(40) }} />
                </ThemeIcon>
            </Center>

            <Stack align="center" gap="md">
                <Title order={1} ta="center" style={{ fontFamily: 'Outfit, sans-serif' }}>주문 완료</Title>
                <Text c="dimmed" ta="center" size="lg">
                    주문해주셔서 감사합니다. <br />
                    주문 내역을 성공적으로 접수했습니다.
                </Text>

                <Text size="sm" c="dimmed" mb="xl">주문 번호 #ORD-{Math.floor(Math.random() * 100000)}</Text>

                <Button component={Link} href="/" size="lg" color="dark">
                    쇼핑 계속하기
                </Button>
            </Stack>
        </Container>
    );
}
