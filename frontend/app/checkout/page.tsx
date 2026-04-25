'use client';

import { Container, Title, TextInput, Group, Button, Paper, Text, Stack, Divider, Grid } from '@mantine/core';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
    const { isLoaded: cartLoaded, items, total } = useCart();
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; // Wait for auth check to complete

        if (!isLoggedIn) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
            return;
        }
        if (cartLoaded && items.length === 0) {
            router.push('/');
        }
    }, [items, cartLoaded, router, isLoggedIn, isLoading]);

    if (isLoading || !cartLoaded) return null; // Or a loader
    if (!isLoggedIn || items.length === 0) return null;

    const finalTotal = total;

    const handlePayment = () => {
        // Pass total to payment page or context if needed, currently just navigating
        router.push('/payment');
    };

    return (
        <Container size="xl" py={80} mt={50}>
            <Title order={1} mb="xl" style={{ fontFamily: 'Outfit, sans-serif' }}>주문서 작성</Title>

            <Grid gutter={50}>
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Title order={3} mb="md">배송지 정보</Title>
                    <Paper withBorder p="xl" radius="md">
                        <Group grow mb="md">
                            <TextInput label="이름" placeholder="홍길동" required />
                            <TextInput label="연락처" placeholder="010-1234-5678" required />
                        </Group>
                        <TextInput label="이메일 (주문 확인용)" placeholder="you@email.com" required mb="md" />

                        <Group align="flex-end" mb="md">
                            <TextInput label="우편번호" placeholder="00000" required style={{ flex: 1 }} />
                            <Button variant="outline" color="gray">주소 찾기</Button>
                        </Group>

                        <TextInput label="주소" placeholder="서울시 강남구..." required mb="md" />
                        <TextInput label="상세 주소" placeholder="101동 101호" mb="md" />

                        <TextInput label="배송 메모" placeholder="부재 시 문 앞에 놔주세요." />
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Title order={3} mb="md">주문 요약</Title>
                    <Paper bg="gray.0" p="xl" radius="md">
                        <Stack gap="md" mb="xl">
                            {items.map(item => (
                                <Group key={item.id} justify="space-between" align="start">
                                    <div>
                                        <Text size="sm" fw={500}>{item.title} x {item.quantity}</Text>
                                        <Text size="xs" c="dimmed">{item.category}</Text>
                                    </div>
                                    <Text size="sm">{(item.price * item.quantity).toLocaleString()} 원</Text>
                                </Group>
                            ))}
                        </Stack>
                        <Divider my="md" />

                        {/* Coupon Section Removed - moved to Payment Page */}

                        <Group justify="space-between" mb="xs">
                            <Text>총 상품 금액</Text>
                            <Text>{total.toLocaleString()} 원</Text>
                        </Group>

                        <Group justify="space-between" mb="xs">
                            <Text>배송비</Text>
                            <Text>무료</Text>
                        </Group>

                        <Divider my="md" />

                        <Group justify="space-between" mb="xl">
                            <Text size="xl" fw={700}>최종 결제 금액</Text>
                            <Text size="xl" fw={700} c="blue">{finalTotal.toLocaleString()} 원</Text>
                        </Group>

                        <Button fullWidth size="lg" color="blue" onClick={handlePayment}>
                            결제하기
                        </Button>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
