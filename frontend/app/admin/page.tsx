'use client';

import { Container, Title, Paper, Text, Group, Table, Button, Tabs, ActionIcon, Select } from '@mantine/core';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconTrash } from '@tabler/icons-react';

export default function AdminPage() {
    const { user, isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>('users');

    // Data State
    const [users, setUsers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]); // QnA Posts

    const [role, setRole] = useState<string>('');

    useEffect(() => {
        if (isLoading) return; // Wait for auth check

        // 역할 쿠키 확인
        fetch('http://localhost:8080/api/role', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setRole(data.role))
            .catch(() => setRole('guest'));

        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        // QnA Data Fetch (Real Backend)
        fetch('http://localhost:8080/api/qna')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error(err));

        // Load Users
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        }

        // Load Orders
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        }
    }, [isLoggedIn, isLoading, router, user]);

    if (isLoading) return <Container size="xl" py={80} mt={50}><Text>Loading...</Text></Container>;

    const handleDeleteUser = (email: string) => {
        if (confirm('정말 이 사용자를 삭제하시겠습니까?')) {
            const newUsers = users.filter(u => u.email !== email);
            setUsers(newUsers);
            localStorage.setItem('users', JSON.stringify(newUsers));
        }
    };

    const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
        const newOrders = orders.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        );
        setOrders(newOrders);
        localStorage.setItem('orders', JSON.stringify(newOrders));
    };

    const handleDeletePost = async (id: number) => {
        if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
            try {
                const res = await fetch(`http://localhost:8080/api/qna/${id}`, {
                    method: 'DELETE',
                    credentials: 'include', // Important: Sends cookies (VULN_ROLE)
                });

                if (res.ok) {
                    alert('삭제되었습니다.');
                    setPosts(posts.filter(p => p.id !== id));
                } else {
                    const text = await res.text();
                    alert(`삭제 실패: ${text}`);
                }
            } catch (e) {
                console.error(e);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    if (!user) return null;

    // Guard for non-admin
    // VULNERABILITY: Check 'role' from cookie. If 'admin', bypass header check.
    const isAdminUser = user.name.includes('admin') || user.email.includes('admin');

    // Allow if actual admin user OR if cookie role is 'admin' (Bypass)
    if (!isAdminUser && role !== 'admin') {
        return (
            <Container size="sm" py={100} ta="center">
                <Title>접근 권한이 없습니다.</Title>
                <Text c="dimmed" mt="md">관리자 계정으로 로그인해주세요.</Text>
                <Button mt="xl" onClick={() => router.push('/')}>홈으로 돌아가기</Button>
            </Container>
        );
    }

    return (
        <Container size="xl" py={80} mt={50}>
            <Title order={1} mb="xl" style={{ fontFamily: 'Outfit, sans-serif' }}>관리자 대시보드</Title>

            <Tabs value={activeTab} onChange={setActiveTab} color="dark">
                <Tabs.List mb="lg">
                    <Tabs.Tab value="users">회원 관리</Tabs.Tab>
                    <Tabs.Tab value="orders">주문 및 배송 관리</Tabs.Tab>
                    <Tabs.Tab value="posts" color="red">게시글 관리 (QnA)</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users">
                    <Paper withBorder p="md" radius="md">
                        <Title order={3} mb="md">가입된 회원 목록</Title>
                        {users.length === 0 ? (
                            <Text c="dimmed">가입된 회원이 없습니다.</Text>
                        ) : (
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>이름</Table.Th>
                                        <Table.Th>이메일</Table.Th>
                                        <Table.Th>가입일</Table.Th>
                                        <Table.Th>관리</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {users.map((u) => (
                                        <Table.Tr key={u.email}>
                                            <Table.Td>{u.name}</Table.Td>
                                            <Table.Td>{u.email}</Table.Td>
                                            <Table.Td>{u.joinedAt || '-'}</Table.Td>
                                            <Table.Td>
                                                <ActionIcon color="red" variant="subtle" onClick={() => handleDeleteUser(u.email)}>
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        )}
                    </Paper>
                </Tabs.Panel>

                <Tabs.Panel value="orders">
                    <Paper withBorder p="md" radius="md">
                        <Title order={3} mb="md">전체 주문 내역</Title>
                        {orders.length === 0 ? (
                            <Text c="dimmed">주문 내역이 없습니다.</Text>
                        ) : (
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>주문번호</Table.Th>
                                        <Table.Th>구매자</Table.Th>
                                        <Table.Th>상품/금액</Table.Th>
                                        <Table.Th>날짜</Table.Th>
                                        <Table.Th>상태</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {orders.map((o) => (
                                        <Table.Tr key={o.id}>
                                            <Table.Td>{o.id}</Table.Td>
                                            <Table.Td>{o.userId || 'Guest'}</Table.Td>
                                            <Table.Td>
                                                <Text size="sm" fw={500}>{o.items?.[0]?.title} 등 {o.items?.length}건</Text>
                                                <Text size="xs" c="dimmed">{o.total?.toLocaleString()}원</Text>
                                            </Table.Td>
                                            <Table.Td>{o.date}</Table.Td>
                                            <Table.Td>
                                                <Select
                                                    size="xs"
                                                    value={o.status}
                                                    data={['주문 완료', '배송 준비중', '배송중', '배송 완료', '교환 신청됨', '환불 신청됨']}
                                                    onChange={(val) => handleUpdateOrderStatus(o.id, val as string)}
                                                />
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        )}
                    </Paper>
                </Tabs.Panel>

                <Tabs.Panel value="posts">
                    <Paper withBorder p="md" radius="md">
                        <Title order={3} mb="md">QnA 게시글 목록</Title>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>ID</Table.Th>
                                    <Table.Th>제목</Table.Th>
                                    <Table.Th>작성자</Table.Th>
                                    <Table.Th>작성일</Table.Th>
                                    <Table.Th>삭제</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {posts.map((post) => (
                                    <Table.Tr key={post.id}>
                                        <Table.Td>{post.id}</Table.Td>
                                        <Table.Td>{post.title}</Table.Td>
                                        <Table.Td>{post.author}</Table.Td>
                                        <Table.Td>{post.createdAt}</Table.Td>
                                        <Table.Td>
                                            <ActionIcon color="red" variant="subtle" onClick={() => handleDeletePost(post.id)}>
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
}
