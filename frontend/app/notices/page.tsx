'use client';

import { Container, Title, Table, Button, Group, Text, Paper, Badge } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function NoticeListPage() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [notices, setNotices] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/notices')
            .then(res => res.json())
            .then(data => setNotices(data))
            .catch(err => console.error(err));
    }, []);

    const isAdmin = user && (user.name?.includes('admin') || user.email?.includes('admin') || document.cookie.includes('VULN_ROLE=admin'));

    return (
        <Container size="lg" py={80} mt={50}>
            <Group justify="space-between" mb="xl">
                <Title order={1} style={{ fontFamily: 'Outfit, sans-serif' }}>공지사항</Title>

                {/* Security by Obscurity: Only show button to admins. 
                    But anyone can go to /notices/write manually! */}
                {isAdmin && (
                    <Button color="red" onClick={() => router.push('/notices/write')}>
                        공지 작성 (Admin)
                    </Button>
                )}
            </Group>

            <Paper withBorder p="md" radius="md">
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>번호</Table.Th>
                            <Table.Th>제목</Table.Th>
                            <Table.Th>작성자</Table.Th>
                            <Table.Th>작성일</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {notices.map((notice) => (
                            <Table.Tr key={notice.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/notices/${notice.id}`)}>
                                <Table.Td>{notice.id}</Table.Td>
                                <Table.Td>
                                    <Text fw={500}>{notice.title}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge color="red" variant="light">ADMIN</Badge> {notice.author}
                                </Table.Td>
                                <Table.Td>{notice.createdAt}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
                {notices.length === 0 && (
                    <Text ta="center" c="dimmed" py="xl">등록된 공지사항이 없습니다.</Text>
                )}
            </Paper>
        </Container>
    );
}
