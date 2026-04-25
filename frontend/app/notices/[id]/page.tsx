'use client';

import { Container, Title, Text, Paper, Button, Group, Badge, Divider } from '@mantine/core';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function NoticeDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [notice, setNotice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:8080/api/notices/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => setNotice(data))
            .catch(err => {
                console.error(err);
                alert('공지사항을 불러올 수 없습니다.');
                router.push('/notices');
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    if (loading) return <Container size="lg" py={80} mt={50}><Text>Loading...</Text></Container>;
    if (!notice) return null;

    return (
        <Container size="lg" py={80} mt={50}>
            <Title order={2} mb="xs" style={{ fontFamily: 'Outfit, sans-serif' }}>{notice.title}</Title>

            <Group mb="xl" gap="xs">
                <Badge color="red" variant="light">ADMIN</Badge>
                <Text size="sm" c="dimmed">{notice.author} · {notice.createdAt}</Text>
            </Group>

            <Paper withBorder p="xl" radius="md" mb="xl">
                <Text style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {notice.content}
                </Text>
            </Paper>

            <Group justify="center">
                <Button variant="default" onClick={() => router.push('/notices')}>
                    목록으로 돌아가기
                </Button>
            </Group>
        </Container>
    );
}
