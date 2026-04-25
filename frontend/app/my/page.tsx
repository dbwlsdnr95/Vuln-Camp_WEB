'use client';

import { Container, Title, Paper, Text, Stack, Group, Badge, Button, Divider, Modal, Textarea, Select, TextInput } from '@mantine/core';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Define Order Interface locally or import if shared
// Define Server Order Interface
interface ServerOrder {
    id: number;
    username: string;
    productName: string;
    price: number;
    imageUrl: string;
    createdAt: string;
}

export default function MyPage() {
    const { user, isLoggedIn, isLoading, updateProfile, changePassword } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<ServerOrder[]>([]);

    // UI State
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

    // Refund/Exchange Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<ServerOrder | null>(null);
    const [requestType, setRequestType] = useState<string | null>('교환');
    const [reason, setReason] = useState('');

    // Profile Edit State
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (isLoading) return; // Wait for auth check
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        if (user) {
            setNewName(user.name);
            setNewEmail(user.email);
            fetchOrders(user.email);
        }
    }, [isLoggedIn, router, user]);

    const fetchOrders = async (userEmail: string) => {
        try {
            const res = await fetch('http://localhost:8080/api/orders');
            if (res.ok) {
                const data: ServerOrder[] = await res.json();
                // 취약점: 클라이언트 단에서 이메일을 기준으로 필터링함 (IDOR 위험)
                const myOrders = data.filter(o => o.username === userEmail);
                // Sort by ID desc (newest first)
                setOrders(myOrders.sort((a, b) => b.id - a.id));
            } else {
                console.error("Failed to fetch orders");
            }
        } catch (e) {
            console.error("Error fetching orders:", e);
        }
    };

    const handleRequest = () => {
        if (!selectedOrder) return;
        alert(`${requestType} 신청이 완료되었습니다. (서버 로직 미구현)`);
        setModalOpen(false);
        setReason('');
    };

    const openRequestModal = (order: ServerOrder) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleUpdateProfile = () => {
        if (newName && newEmail) {
            updateProfile(newName, newEmail);
        } else {
            alert('이름과 이메일을 모두 입력해주세요.');
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmPassword) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            // VULNERABILITY: CSRF - Changing password using only cookie auth
            const res = await fetch('http://localhost:8080/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Sends VULN_USER cookie
                body: JSON.stringify({ password: newPassword })
            });

            if (res.ok) {
                alert('비밀번호가 변경되었습니다.');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const msg = await res.text();
                alert('변경 실패: ' + msg);
            }
        } catch (e) {
            console.error(e);
            alert('오류가 발생했습니다.');
        }
    };

    if (isLoading) return <Container size="xl" py={80} mt={50}><Text>Loading...</Text></Container>;
    if (!user) return null;

    return (
        <Container size="xl" py={80} mt={50}>
            <Title order={1} mb="xl" style={{ fontFamily: 'Outfit, sans-serif' }}>마이페이지</Title>

            <Group align="flex-start">
                {/* Sidebar */}
                <Stack style={{ width: 250 }} gap="xs">
                    <Paper p="md" withBorder radius="md" bg="gray.0">
                        <Text fw={700} size="lg">{user.name}님</Text>
                        <Text size="xs" c="dimmed">{user.email}</Text>
                    </Paper>
                    <Button
                        variant={activeTab === 'orders' ? 'light' : 'subtle'}
                        color="dark"
                        fullWidth
                        justify="flex-start"
                        onClick={() => setActiveTab('orders')}
                    >
                        주문 내역
                    </Button>
                    <Button
                        variant={activeTab === 'profile' ? 'light' : 'subtle'}
                        color="dark"
                        fullWidth
                        justify="flex-start"
                        onClick={() => setActiveTab('profile')}
                    >
                        개인 정보 수정
                    </Button>
                    <Link href="/logout" style={{ width: '100%' }}>
                        <Button
                            variant="subtle"
                            color="red"
                            fullWidth
                            justify="flex-start"
                        >
                            로그아웃
                        </Button>
                    </Link>
                </Stack>

                {/* Main Content */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'orders' && (
                        <>
                            <Title order={3} mb="lg">주문 내역 (실시간 서버 데이터)</Title>

                            {orders.length === 0 ? (
                                <Paper p="xl" withBorder radius="md" ta="center">
                                    <Text c="dimmed">주문 내역이 없습니다.</Text>
                                </Paper>
                            ) : (
                                <Stack>
                                    {orders.map(order => (
                                        <Paper key={order.id} p="lg" withBorder radius="md">
                                            <Group justify="space-between" mb="sm">
                                                <div>
                                                    <Text fw={700} size="lg">주문번호 #{order.id}</Text>
                                                    <Text size="xs" c="dimmed">{new Date(order.createdAt).toLocaleString()}</Text>
                                                </div>
                                                <Badge
                                                    color={'green'}
                                                    size="lg"
                                                >
                                                    결제 완료
                                                </Badge>
                                            </Group>
                                            <Divider my="sm" />

                                            <Group mb="sm">
                                                {/* Image if available */}
                                                {order.imageUrl && <img src={order.imageUrl} alt={order.productName} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />}
                                                <div>
                                                    <Text size="sm" fw={500}>{order.productName}</Text>
                                                    <Text size="xs" c="dimmed">구매자: {order.username}</Text>
                                                </div>
                                            </Group>

                                            <Group justify="space-between" mt="md">
                                                <Text fw={700} c={order.price === 0 ? 'red' : 'dark'}>
                                                    결제금액: {order.price.toLocaleString()}원
                                                    {order.price === 0 && " (⚠️ 변조됨)"}
                                                </Text>

                                                <Button variant="outline" size="xs" color="gray" onClick={() => openRequestModal(order)}>
                                                    교환/환불 신청
                                                </Button>
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}
                        </>
                    )}

                    {activeTab === 'profile' && (
                        <>
                            <Title order={3} mb="lg">개인 정보 수정</Title>
                            <Paper p="xl" withBorder radius="md">
                                <Stack maw={400}>
                                    <TextInput
                                        label="이름"
                                        value={newName}
                                        onChange={(e) => setNewName(e.currentTarget.value)}
                                    />
                                    <TextInput
                                        label="이메일"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.currentTarget.value)}
                                    />
                                    <Button color="dark" mt="md" onClick={handleUpdateProfile}>
                                        정보 수정 저장
                                    </Button>
                                </Stack>
                            </Paper>

                            <Title order={3} mb="lg" mt="xl">비밀번호 변경</Title>
                            <Paper p="xl" withBorder radius="md">
                                <Stack maw={400}>
                                    <TextInput
                                        label="새 비밀번호"
                                        type="password"
                                        placeholder="새 비밀번호 입력"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.currentTarget.value)}
                                    />
                                    <TextInput
                                        label="새 비밀번호 확인"
                                        type="password"
                                        placeholder="새 비밀번호 확인"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                                    />
                                    <Button color="red" mt="md" onClick={handleUpdatePassword}>
                                        비밀번호 변경
                                    </Button>
                                </Stack>
                            </Paper>
                        </>
                    )}
                </div>
            </Group>

            {/* Exchange/Refund Modal */}
            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="교환/환불 신청">
                <Stack>
                    <Select
                        label="신청 유형"
                        data={['교환', '환불']}
                        value={requestType}
                        onChange={setRequestType}
                    />
                    <Textarea
                        label="사유"
                        placeholder="상세 사유를 입력해주세요 (예: 사이즈 안 맞음, 상품 불량)"
                        minRows={3}
                        value={reason}
                        onChange={(e) => setReason(e.currentTarget.value)}
                    />
                    <Button color="dark" fullWidth onClick={handleRequest}>신청하기</Button>
                </Stack>
            </Modal>
        </Container>
    );
}
