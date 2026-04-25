'use client';

import { Container, Title, Button, Paper, Text, Stack, Modal, TextInput, Grid, Group, Divider, Checkbox, LoadingOverlay, Loader } from '@mantine/core';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Script from 'next/script'; // Import Script

declare global {
    interface Window {
        validateCoupon?: (code: string) => boolean;
    }
}

export default function PaymentPage() {
    const { total, items, clearCart } = useCart();
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [selectedCard, setSelectedCard] = useState('hack');
    const [cardNumber1, setCardNumber1] = useState('');
    const [cardNumber2, setCardNumber2] = useState('');
    const [cardNumber3, setCardNumber3] = useState('');
    const [cardNumber4, setCardNumber4] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [cardPw, setCardPw] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [discountRate, setDiscountRate] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);

    // Protect Helper
    useEffect(() => {
        if (isLoading) return;
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, isLoading, router]);

    if (isLoading) return <Container size="sm" py={80} mt={50}><Text>Loading...</Text></Container>;

    // Load external validator script
    // <Script src="/js/validator.js" strategy="lazyOnload" /> is not usable directly inside component body in typical React flow without Next.js Script optimization at page level or layout.

    // Note: We need to ensure the script is loaded in the return JSX below

    const handleOpenPayment = () => {
        setModalOpen(true);
    };

    const handleApplyCoupon = async () => {
        // [VULNERABILITY] Client-Side Validation
        // The validation logic is hidden in /js/validator.js (Obfuscated)
        // Attackers can analyze that file to generate a valid code.

        if (typeof window.validateCoupon !== 'function') {
            // Script hasn't loaded or blocked
            alert('보안 모듈 로딩 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        const isValid = window.validateCoupon(couponCode);

        if (isValid) {
            // 취약점: 클라이언트의 검증 결과를 무조건 신뢰함
            setDiscountRate(20); // 20% 할인 적용
            setCouponApplied(true);
            alert('쿠폰이 유효합니다! (클라이언트 검증 성공)');
        } else {
            alert('유효하지 않은 쿠폰입니다.');
            setDiscountRate(0);
            setCouponApplied(false);
        }
    };

    const handleConfirmPayment = () => {
        if (!termsAgreed) {
            alert('전자금융거래 이용약관에 동의해주세요.');
            return;
        }
        if (cardNumber1.length < 4 || cardNumber2.length < 4 || cardNumber3.length < 4 || cardNumber4.length < 4) {
            alert('카드 번호를 올바르게 입력해주세요.');
            return;
        }

        setProcessing(true);
        // Simulate payment gateway delay
        setTimeout(async () => {
            // Save Order Logic via Backend API (Vulnerable Endpoint)
            try {
                const userStr = localStorage.getItem('user'); // Basic auth context from local storage if available
                const user = userStr ? JSON.parse(userStr) : null;
                const username = user && user.email ? user.email : 'guest';

                // 각 상품별 주문 생성
                for (const item of items) {
                    await fetch('http://localhost:8080/api/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: username,
                            productName: item.title,
                            // Apply discount if any
                            price: Math.floor(item.price * (1 - discountRate / 100)),
                            imageUrl: item.image
                        }),
                    });
                }

                // 주문 성공 페이지 표시를 위해 로컬 스토리지에도 저장
                const newOrder = {
                    id: `ORD-${Date.now()}`,
                    date: new Date().toLocaleDateString(),
                    items: items,
                    total: total,
                    status: '주문 완료'
                };
                const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
                localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));

                clearCart();
                router.push('/order-complete');
            } catch (e) {
                console.error(e);
                alert('결제 처리 중 오류가 발생했습니다.');
            } finally {
                setProcessing(false);
            }
        }, 3000);
    };

    return (
        <Container size="sm" py={80} mt={50}>
            <Script src="/js/validator.js" strategy="lazyOnload" />
            <Title order={1} ta="center" mb="xl" style={{ fontFamily: 'Outfit, sans-serif' }}>결제하기</Title>

            <Paper withBorder p="xl" radius="md">
                <Stack align="center" gap="xl" py="xl">
                    <Text size="lg">총 결제 금액</Text>
                    <Text size="xl" fw={900} fz={40}>{total.toLocaleString()} 원</Text>

                    {/* 쿠폰 입력 섹션 */}
                    <Group mt="md">
                        <TextInput
                            placeholder="쿠폰 코드 입력"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={couponApplied}
                        />
                        <Button color="dark" onClick={handleApplyCoupon} disabled={couponApplied}>
                            적용
                        </Button>
                    </Group>
                    {couponApplied && <Text c="green">쿠폰이 적용되었습니다! (할인율: {discountRate}%)</Text>}

                    <Button size="xl" color="green" fullWidth onClick={handleOpenPayment}>
                        결제하기
                    </Button>
                </Stack>
            </Paper>

            <Modal
                opened={modalOpen}
                onClose={() => !processing && setModalOpen(false)}
                title="카드 결제"
                centered
                closeOnClickOutside={!processing}
            >
                <LoadingOverlay visible={processing} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ children: <Stack align="center"><Loader color="blue" /><Text size="sm" mt="sm">결제 승인 중...</Text></Stack> }} />

                <Stack>
                    <Grid align="center" mt="md">
                        <Grid.Col span={3}><Text size="sm" fw={500} mt={5}>결제 수단</Text></Grid.Col>
                        <Grid.Col span={9}>
                            <Group gap="xs" mb="sm">
                                <Button
                                    variant={selectedCard === 'hack' ? 'filled' : 'outline'}
                                    color="grape"
                                    size="xs"
                                    onClick={() => setSelectedCard('hack')}
                                >
                                    HACK 카드
                                </Button>
                            </Group>
                            <Group gap="xs">
                                <Button variant="outline" size="xs" color="gray" disabled>현대카드</Button>
                                <Button variant="outline" size="xs" color="gray" disabled>삼성카드</Button>
                                <Button variant="outline" size="xs" color="gray" disabled>신한카드</Button>
                                <Button variant="outline" size="xs" color="gray" disabled>네이버페이</Button>
                                <Button variant="outline" size="xs" color="gray" disabled>카카오페이</Button>
                            </Group>
                        </Grid.Col>
                    </Grid>

                    <Grid align="center">
                        <Grid.Col span={3}><Text size="sm" fw={500}>카드 번호</Text></Grid.Col>
                        <Grid.Col span={9}>
                            <Group gap={5} grow>
                                <TextInput placeholder="1234" maxLength={4} value={cardNumber1} onChange={(e) => setCardNumber1(e.currentTarget.value)} />
                                <TextInput placeholder="****" type="password" maxLength={4} value={cardNumber2} onChange={(e) => setCardNumber2(e.currentTarget.value)} />
                                <TextInput placeholder="****" type="password" maxLength={4} value={cardNumber3} onChange={(e) => setCardNumber3(e.currentTarget.value)} />
                                <TextInput placeholder="5678" maxLength={4} value={cardNumber4} onChange={(e) => setCardNumber4(e.currentTarget.value)} />
                            </Group>
                        </Grid.Col>
                    </Grid>

                    <Grid align="center">
                        <Grid.Col span={3}><Text size="sm" fw={500}>유효기간</Text></Grid.Col>
                        <Grid.Col span={4}>
                            <TextInput placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={(e) => setCardExpiry(e.currentTarget.value)} />
                        </Grid.Col>
                        <Grid.Col span={2}><Text size="sm" fw={500} ta="right">CVC</Text></Grid.Col>
                        <Grid.Col span={3}>
                            <TextInput placeholder="000" type="password" maxLength={3} value={cardCvc} onChange={(e) => setCardCvc(e.currentTarget.value)} />
                        </Grid.Col>
                    </Grid>

                    <Grid align="center">
                        <Grid.Col span={3}><Text size="sm" fw={500}>비밀번호</Text></Grid.Col>
                        <Grid.Col span={9}>
                            <Group gap="xs">
                                <TextInput placeholder="**" type="password" maxLength={2} style={{ width: 60 }} value={cardPw} onChange={(e) => setCardPw(e.currentTarget.value)} />
                                <Text size="sm">앞 2자리</Text>
                            </Group>
                        </Grid.Col>
                    </Grid>

                    <Divider my="sm" />

                    <Checkbox
                        label="전자금융거래 이용약관에 동의합니다."
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.currentTarget.checked)}
                    />

                    <Button fullWidth size="lg" mt="md" onClick={handleConfirmPayment}>
                        {Math.floor(total * (1 - discountRate / 100)).toLocaleString()}원 결제하기
                    </Button>
                </Stack>
            </Modal>
        </Container>
    );
}
